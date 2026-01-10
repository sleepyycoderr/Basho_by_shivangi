from django.urls import path
from .views import (
    ProductListView,
    ProductDetailView,
    ProductByCategoryView,
    FeaturedProductListView,
    CustomOrderCreateView,
)
from .admin_views import send_custom_order_email


urlpatterns = [
    # Products
    path("", ProductListView.as_view(), name="product-list"),
    path("featured/", FeaturedProductListView.as_view(), name="featured-products"),
    path("category/<slug:slug>/", ProductByCategoryView.as_view(), name="products-by-category"),
    # Custom Orders (MUST come before <str:id>)
    path("custom-orders/", CustomOrderCreateView.as_view(), name="custom-order-create"),
    # Single product
    path("<str:id>/", ProductDetailView.as_view(), name="product-detail"),
]
