import email
import razorpay,json
from django.conf import settings
from email.mime.image import MIMEImage
import os
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from apps.orders.models import PaymentOrder
from apps.orders.models import Payment, Transaction
os.environ["PYTHONHTTPSVERIFY"] = "1"
import socket

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


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
        # 1. Verify signature
        client.utility.verify_payment_signature({
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature
        })
        print("🔥 PAYMENT SIGNATURE VERIFIED")
        # 2. Mark PaymentOrder as PAID
        payment_order = PaymentOrder.objects.get(razorpay_order_id=razorpay_order_id)
        payment_order.status = "PAID"
        payment_order.save()
        print("🔥 PaymentOrder marked as PAID")
        # 3. Save payment
        payment = Payment.objects.create(
            payment_order=payment_order,
            razorpay_payment_id=razorpay_payment_id,
            status="PAID"
        )
        print("🔥 Payment record created")
        # 4. Save transaction log
        Transaction.objects.create(
            payment=payment,
            event="verified",
            response=data
        )
        print("🔥 Transaction log created")
  # Render HTML email template
        # html_content = render_to_string(
        # "emails/order_success.html",
        # {"order_id": payment_order.id}
        
        # )

# Resolve recipient email
    #     recipient_email = (
    #         payment_order.product_order.email
    # if hasattr(payment_order, "product_order")
    # else payment_order.user.email
    # )

    #     print("🔥 Sending confirmation email to:", recipient_email)

# Create email
        # email = EmailMultiAlternatives(
        # subject="Your Basho Order is Confirmed 🌿",
        #     body="Your payment was successful.",
        #     from_email=settings.EMAIL_HOST_USER,
        #     to=[recipient_email],
        # )
# Attach HTML version
        # email.attach_alternative(html_content, "text/html")

# Attach inline image
        # image_path = os.path.join(settings.BASE_DIR, "static", "care_card.png")

        # with open(image_path, "rb") as f:
        #     img = MIMEImage(f.read())
        #     img.add_header("Content-ID", "<care_card>")
        #     img.add_header("Content-Disposition", "inline", filename="care_card.png")
        #     email.attach(img)



        #email.send()


        #return JsonResponse({"status": "success"})

    except Exception as e:
        try:
            payment_order = PaymentOrder.objects.get(
                razorpay_order_id=data.get("razorpay_order_id")
            )
            payment_order.status = "FAILED"
            payment_order.save()

            payment = Payment.objects.create(
                payment_order=payment_order,
                razorpay_payment_id=data.get("razorpay_payment_id", "FAILED"),
                status="FAILED"
            )

            Transaction.objects.create(
                payment=payment,
                event="failed",
                response=data
            )
        except:
            pass

        return JsonResponse({"error": "Payment verification failed"}, status=400)