import json
import razorpay

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.db import transaction
from django.core.mail import send_mail

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from apps.orders.models import (
    Cart, Order, OrderItem,
    PaymentOrder, Payment, Transaction
)
from apps.products.models import Product


client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


# ====================================================
# CREATE ORDER + CREATE RAZORPAY ORDER
# LOGIN REQUIRED
# ====================================================

@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def create_product_order(request):

    data = json.loads(request.body or "{}")
    customer = data.get("customer")

    if not customer:
        return JsonResponse({"error": "Customer data missing"}, status=400)

    # 🔐 LOCK CART
    cart = Cart.objects.select_for_update().filter(
        user=request.user,
        is_active=True
    ).first()

    if not cart or not cart.items.exists():
        return JsonResponse({"error": "Cart is empty"}, status=400)

    subtotal = 0
    total_weight = 0
    validated_items = []

    # 🔒 LOCK PRODUCTS (ANTI-OVERSELL)
    for item in cart.items.select_related("product"):
        product = Product.objects.select_for_update().get(id=item.product.id)

        if product.stock < item.quantity:
            return JsonResponse(
                {"error": f"{product.name} is out of stock"},
                status=400
            )

        subtotal += product.price * item.quantity
        total_weight += product.weight * item.quantity

        validated_items.append((item, product))

    shipping_cost = 50
    gst = round((subtotal + shipping_cost) * 0.18, 2)
    total_amount = subtotal + shipping_cost + gst


    # =========================
    # MASTER PAYMENT ORDER
    # =========================
    payment_order = PaymentOrder.objects.create(
        user=request.user,
        order_type="PRODUCT",
        amount=total_amount,
        status="PENDING"
    )

    # =========================
    # RAZORPAY ORDER
    # =========================
    razorpay_order = client.order.create({
        "amount": int(round(total_amount * 100)),
        "currency": "INR",
        "payment_capture": 1
    })

    payment_order.razorpay_order_id = razorpay_order["id"]
    payment_order.save()

    # =========================
    # PRODUCT ORDER
    # =========================
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

    # =========================
    # ORDER ITEMS SNAPSHOT
    # =========================
    for item, product in validated_items:
        OrderItem.objects.create(
            order=order,
            product=product,
            product_name=product.name,
            price=product.price,
            quantity=item.quantity,
            weight_kg=product.weight
        )

    return JsonResponse({
        "order_id": order.id,
        "razorpay_order_id": razorpay_order["id"],
        "amount": int(total_amount * 100),
        "currency": "INR",
        "key": settings.RAZORPAY_KEY_ID
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_orders(request):
    orders = Order.objects.filter(
        payment_order__user=request.user
    ).order_by("-created_at")

    data = []
    for o in orders:
        data.append({
            "id": o.id,
            "total": o.total_amount,
            "status": o.status,
            "created_at": o.created_at,
            "items": [
                {
                    "name": i.product_name,
                    "qty": i.quantity,
                    "price": i.price
                } for i in o.items.all()
            ]
        })

    return JsonResponse({"orders": data})