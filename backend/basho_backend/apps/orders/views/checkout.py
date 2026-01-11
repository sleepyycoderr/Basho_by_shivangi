from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from apps.orders.models import Cart, Order, OrderItem, PaymentOrder, Payment, Transaction
from apps.products.models import Product
import razorpay, json

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


# ====================================================
# CREATE ORDER + CREATE RAZORPAY ORDER
# ====================================================

@csrf_exempt
def create_product_order(request):
    print("🔥 POST REACHED VIEW")
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    data = json.loads(request.body)
    customer = data.get("customer")
    items = data.get("items", [])

    if not items:
        return JsonResponse({"error": "No items sent"}, status=400)

    subtotal = 0
    total_weight = 0
    validated_items = []

    # ✅ SERVER SIDE VALIDATION
    for item in items:
        product = Product.objects.get(id=item["id"])
        qty = int(item["qty"])
        price = product.price
        weight = getattr(product, "weight_kg", 0)

        subtotal += price * qty
        total_weight += weight * qty

        validated_items.append({
            "product": product,
            "qty": qty,
            "price": price,
            "weight": weight
        })

    shipping_cost = 50
    total_amount = subtotal + shipping_cost

    # ✅ 1. Payment Order (MASTER)
    payment_order = PaymentOrder.objects.create(
        user=request.user if request.user.is_authenticated else None,
        order_type="PRODUCT",
        amount=total_amount,
        status="PENDING"
    )

    # ✅ 2. Razorpay order
    razorpay_order = client.order.create({
        "amount": int(total_amount * 100),
        "currency": "INR",
        "payment_capture": 1
    })

    payment_order.razorpay_order_id = razorpay_order["id"]
    payment_order.save()

    # ✅ 3. Product order
    order = Order.objects.create(
        payment_order=payment_order,
        full_name=customer["fullName"],
        email=customer["email"],
        phone=customer["phone"],
        address=customer["address"],
        city=customer["city"],
        pincode=customer["pincode"],
        gst_number=customer.get("gstNumber"),
        subtotal=subtotal,
        shipping_cost=shipping_cost,
        total_weight=total_weight,
        total_amount=total_amount
    )

    payment_order.linked_object_id = order.id
    payment_order.linked_app = "orders"
    payment_order.save()

    # ✅ 4. Snapshot items
    for v in validated_items:
        OrderItem.objects.create(
            order=order,
            product_name=v["product"].name,
            price=v["price"],
            quantity=v["qty"],
            weight_kg=v["weight"]
        )
    print("🧾 CREATED ORDER ID:", razorpay_order["id"])

    return JsonResponse({
        "order_id": order.id,
        "payment_order_id": payment_order.id,
        "razorpay_order_id": razorpay_order["id"],
        "amount": int(total_amount * 100),
        "currency": "INR",
        "key": settings.RAZORPAY_KEY_ID
    })


# ====================================================
# VERIFY PAYMENT
# ====================================================

@csrf_exempt
def verify_payment(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    data = json.loads(request.body)

    try:
        client.utility.verify_payment_signature({
            "razorpay_payment_id": data["razorpay_payment_id"],
            "razorpay_order_id": data["razorpay_order_id"],
            "razorpay_signature": data["razorpay_signature"]
        })
    except:
        return JsonResponse({"status": "failed"}, status=400)

    payment_order = PaymentOrder.objects.get(
        razorpay_order_id=data["razorpay_order_id"]
    )

    payment = Payment.objects.create(
        payment_order=payment_order,
        razorpay_payment_id=data["razorpay_payment_id"],
        razorpay_signature=data["razorpay_signature"],
        status="success"
    )

    payment_order.status = "PAID"
    payment_order.save()

    order = payment_order.product_order
    order.status = "paid"
    order.save()

    Transaction.objects.create(
        payment=payment,
        event="payment_success",
        response=data
    )

    return JsonResponse({"status": "success"})