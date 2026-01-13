import json
import razorpay
import os

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction

from apps.orders.models import PaymentOrder, Payment, Transaction
from apps.experiences.models import Booking, WorkshopRegistration

os.environ["PYTHONHTTPSVERIFY"] = "1"

client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)


# ==============================
# POST-PAYMENT CONFIRMATIONS
# ==============================

def confirm_experience_booking(payment_order):
    with transaction.atomic():
        booking = Booking.objects.select_for_update().get(
            id=payment_order.linked_object_id
        )

        # Prevent double confirmation
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


# ==============================
# VERIFY PAYMENT (SINGLE SOURCE OF TRUTH)
# ==============================

@csrf_exempt
def verify_payment(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    data = json.loads(request.body)
    print("🔥 VERIFY PAYMENT DATA:", data)

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
        print("🔥 PAYMENT SIGNATURE VERIFIED")

        # 2️⃣ Fetch & update PaymentOrder
        payment_order = PaymentOrder.objects.get(
            razorpay_order_id=razorpay_order_id
        )
        payment_order.status = "PAID"
        payment_order.save()
        print("🔥 PaymentOrder marked as PAID")

        # 3️⃣ Save payment record
        payment = Payment.objects.create(
            payment_order=payment_order,
            razorpay_payment_id=razorpay_payment_id,
            status="PAID"
        )
        print("🔥 Payment record created")

        # 4️⃣ Save transaction log
        Transaction.objects.create(
            payment=payment,
            event="verified",
            response=data
        )
        print("🔥 Transaction log created")

        # 5️⃣ POST-PAYMENT BUSINESS LOGIC
        if payment_order.order_type == "EXPERIENCE":
            confirm_experience_booking(payment_order)

        elif payment_order.order_type == "WORKSHOP":
            confirm_workshop_registration(payment_order)

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