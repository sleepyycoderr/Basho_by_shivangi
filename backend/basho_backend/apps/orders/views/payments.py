import json
import razorpay
import os
from rest_framework.decorators import api_view, permission_classes
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from apps.orders.models import Cart
from apps.orders.models import PaymentOrder, Payment, Transaction
from apps.orders.models import OrderItem
from apps.products.models import Product
from apps.experiences.models import Booking, WorkshopRegistration
 


os.environ["PYTHONHTTPSVERIFY"] = "1"

client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

# ====================================================
# EXPERIENCE CONFIRMATION
# ====================================================

def confirm_experience_booking(payment_order):
    with transaction.atomic():
        booking = Booking.objects.select_for_update().get(
            id=payment_order.linked_object_id
        )

        if booking.status == "confirmed":
            return

        slot = booking.slot
        people = booking.number_of_people

        if slot.booked_participants + people > slot.max_participants:
            raise Exception("Experience slot is full")

        slot.booked_participants += people
        slot.save()

        booking.status = "confirmed"
        booking.save()


# ====================================================
# WORKSHOP CONFIRMATION
# ====================================================

def confirm_workshop_registration(payment_order):
    with transaction.atomic():
        registration = WorkshopRegistration.objects.select_for_update().get(
            id=payment_order.linked_object_id
        )

        if registration.status == "confirmed":
            return

        slot = registration.slot
        people = registration.number_of_participants

        if people > slot.available_spots:
            raise Exception("Workshop slot is full")

        slot.available_spots -= people
        if slot.available_spots == 0:
            slot.is_available = False

        slot.save()

        registration.status = "confirmed"
        registration.save()


# ====================================================
# PRODUCT CONFIRMATION
# ====================================================

def confirm_product_order(payment_order):
    with transaction.atomic():
        order = payment_order.product_order

        if order.status == "paid":
            return

        # 🔒 Lock products and reduce stock
        for item in order.items.select_related("product"):
            product = Product.objects.select_for_update().get(id=item.product.id)

            if product.stock < item.quantity:
                raise Exception(f"{product.name} stock insufficient")

            product.stock -= item.quantity
            product.save()

        # ✅ Mark order paid
        order.status = "paid"
        order.save()

        # ✉️ Send confirmation email
        try:
            send_product_email(order)
        except Exception as e:
            print("❌ Email failed:", e)



# ====================================================
# EMAIL SENDER
# ====================================================

def send_product_email(order):
    html_content = render_to_string(
        "emails/order_success.html",
        {
            "order_id": order.id,
            "customer_name": order.full_name,
            "order": order
        }
    )

    recipient_email = order.email

    msg = EmailMultiAlternatives(
        subject="Your Basho Order is Confirmed 🌿",
        body="Your payment was successful.",
        from_email=settings.EMAIL_HOST_USER,
        to=[recipient_email],
    )

    msg.attach_alternative(html_content, "text/html")
    msg.send(fail_silently=False)

    print("✅ PRODUCT EMAIL SENT TO:", recipient_email)

def clear_user_cart(payment_order):
    if not payment_order.user:
        return  # guest checkout → no cart to clear

    cart = Cart.objects.filter(
        user=payment_order.user,
        is_active=True
    ).first()

    if not cart:
        return

    cart.items.all().delete()
    cart.is_active = False   # optional but recommended
    cart.save()

    print("🧹 Cart cleared for user:", payment_order.user.id)
# ====================================================
# VERIFY PAYMENT (SINGLE SOURCE OF TRUTH)
# ====================================================

@csrf_exempt
@api_view(["POST"])
def verify_payment(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    data = json.loads(request.body)

    razorpay_order_id = data.get("razorpay_order_id")
    razorpay_payment_id = data.get("razorpay_payment_id")
    razorpay_signature = data.get("razorpay_signature")

    try:
        # 1️⃣ Verify Razorpay signature
        client.utility.verify_payment_signature({
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature
        })

        # 2️⃣ Lock & fetch payment order
        with transaction.atomic():
            payment_order = PaymentOrder.objects.select_for_update().get(
                razorpay_order_id=razorpay_order_id
            )

            if payment_order.status == "PAID":
                return JsonResponse({"status": "already_paid"})

            payment_order.status = "PAID"
            payment_order.save()

            # 3️⃣ Create payment record
            payment = Payment.objects.create(
                payment_order=payment_order,
                razorpay_payment_id=razorpay_payment_id,
                status="PAID"
            )

            # 4️⃣ Transaction log
            Transaction.objects.create(
                payment=payment,
                event="verified",
                response=data
            )

        # 5️⃣ Post-payment business logic
        if payment_order.order_type == "EXPERIENCE":
            confirm_experience_booking(payment_order)

        elif payment_order.order_type == "WORKSHOP":
            confirm_workshop_registration(payment_order)

        elif payment_order.order_type == "PRODUCT":
            confirm_product_order(payment_order)
            clear_user_cart(payment_order)
        return JsonResponse({"status": "success"})

    except Exception as e:
        print("❌ PAYMENT FAILED:", str(e))

        try:
            payment_order = PaymentOrder.objects.get(
                razorpay_order_id=razorpay_order_id
            )

            payment_order.status = "FAILED"
            payment_order.save()

            payment = Payment.objects.create(
                payment_order=payment_order,
                razorpay_payment_id=razorpay_payment_id or "FAILED",
                status="FAILED"
            )

            Transaction.objects.create(
                payment=payment,
                event="failed",
                response=data
            )
        except Exception:
            pass

        return JsonResponse(
            {"error": "Payment verification failed"},
            status=400
        )
