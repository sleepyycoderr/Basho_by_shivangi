import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.orders.models import Cart, CartItem
from apps.products.models import Product


# ------------------------
# HELPERS
# ------------------------

def get_or_create_cart(request):
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user, is_active=True)
        return cart

    cart_id = request.session.get("cart_id")
    if cart_id:
        try:
            return Cart.objects.get(id=cart_id, is_active=True)
        except Cart.DoesNotExist:
            pass

    cart = Cart.objects.create(is_active=True)
    request.session["cart_id"] = cart.id
    return cart


# ------------------------
# GET CART
# ------------------------

@api_view(["GET"])
@permission_classes([AllowAny])
def get_cart(request):
    cart = get_or_create_cart(request)

    items = []
    for item in cart.items.select_related("product"):
        items.append({
            "id": item.id,
            "product_id": item.product.id,
            "name": item.product.name,
            "price": float(item.product.price),
            "stock": item.product.stock,
            "image": item.product.image.url if item.product.image else "",
            "quantity": item.quantity
        })

    return Response({
        "cart_id": cart.id,
        "items": items,
        "total_price": cart.total_price(),
        "total_weight": cart.total_weight()
    })


# ------------------------
# ADD TO CART
# ------------------------

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def add_to_cart(request):
    data = json.loads(request.body or "{}")
    product_id = data.get("product_id")
    qty = int(data.get("quantity", 1))

    product = Product.objects.get(id=product_id)
    cart = get_or_create_cart(request)

    item, _ = CartItem.objects.get_or_create(cart=cart, product=product)
    item.quantity = min(item.quantity + qty, product.stock)
    item.save()

    return Response({"message": "Item added"})


# ------------------------
# UPDATE CART
# ------------------------

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def update_cart(request):
    data = json.loads(request.body or "{}")
    item_id = data.get("item_id")
    qty = int(data.get("quantity", 1))

    item = CartItem.objects.get(id=item_id)

    if qty <= 0:
        item.delete()
    else:
        item.quantity = min(qty, item.product.stock)
        item.save()

    return Response({"message": "Cart updated"})


# ------------------------
# REMOVE ITEM
# ------------------------

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def remove_from_cart(request):
    data = json.loads(request.body or "{}")
    item_id = data.get("item_id")

    CartItem.objects.filter(id=item_id).delete()
    return Response({"message": "Item removed"})


# ------------------------
# CLEAR CART
# ------------------------

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def clear_cart(request):
    cart = get_or_create_cart(request)
    cart.items.all().delete()
    return Response({"message": "Cart cleared"})
