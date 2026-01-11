from django.urls import path
from apps.orders.views.cart import add_to_cart, get_cart, remove_from_cart,clear_cart,update_cart
from apps.orders.views.checkout import create_product_order
from apps.orders.views.payments import verify_payment
urlpatterns = [
    path("cart/", get_cart),
    path("cart/add/", add_to_cart),
    path("cart/update/", update_cart),
    path("cart/remove/", remove_from_cart),
    path("cart/clear/", clear_cart),
    path("cart/remove/<int:item_id>/", remove_from_cart),
    path("checkout/product/", create_product_order),
    path("payment/verify/", verify_payment),

]