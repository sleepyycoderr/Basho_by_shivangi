from django.shortcuts import render

from rest_framework import generics,status
from .models import Product
from .serializers import ProductSerializer,CustomOrderSerializer 
from .models import CustomOrder, CustomOrderImage
 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser


# List all products
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.select_related("category").all()
    serializer_class = ProductSerializer


# Single product detail
class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.select_related("category").all()
    serializer_class = ProductSerializer
    lookup_field = "id"


# Products by category slug
class ProductByCategoryView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        slug = self.kwargs["slug"]
        return Product.objects.select_related("category").filter(
            category__slug=slug
        )


# Featured products
class FeaturedProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.select_related("category").filter(
            featured=True
        )

# Create custom order
class CustomOrderCreateView(generics.CreateAPIView):
    queryset = CustomOrder.objects.all()
    serializer_class = CustomOrderSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_context(self):
        # ensures serializer has access to request.FILES
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

 