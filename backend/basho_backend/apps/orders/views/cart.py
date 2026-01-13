import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from apps.orders.models import Cart, CartItem

from apps.products.models import Product


def get_or_create_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user, is_active=True)
    return cart


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart = get_or_create_cart(request.user)

    items = []
    for item in cart.items.select_related("product"):
        items.append({
            "id": item.id,
            "product_id": item.product.id,
            "name": item.product.name,
            "price": item.product.price,
            "stock": item.product.stock,
            "image": item.product.image.url if item.product.image else "",
            "quantity": item.quantity
        })

    return JsonResponse({
        "items": items,
        "total_price": cart.total_price(),
        "total_weight": cart.total_weight()
    })


@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    data = json.loads(request.body)
    product_id = data.get("product_id")
    qty = int(data.get("quantity", 1))

    product = Product.objects.get(id=product_id)
    cart = get_or_create_cart(request.user)

    item, created = CartItem.objects.get_or_create(cart=cart, product=product)

    if not created:
        item.quantity += qty
    else:
        item.quantity = qty

    item.save()

    return JsonResponse({"message": "Item added"})


@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_cart(request):
    data = json.loads(request.body)
    item_id = data.get("item_id")
    qty = int(data.get("quantity"))

    item = CartItem.objects.get(id=item_id, cart__user=request.user)

    if qty <= 0:
        item.delete()
    else:
        item.quantity = qty
        item.save()

    return JsonResponse({"message": "Cart updated"})


@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    data = json.loads(request.body)
    item_id = data.get("item_id")

    CartItem.objects.filter(id=item_id, cart__user=request.user).delete()

    return JsonResponse({"message": "Item removed"})


@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    cart = get_or_create_cart(request.user)
    cart.items.all().delete()
    return JsonResponse({"message": "Cart cleared"})