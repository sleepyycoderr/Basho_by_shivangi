from django.shortcuts import render
from django.urls import reverse

from rest_framework import generics,status
from .models import Product
from .serializers import ProductSerializer,CustomOrderSerializer 
from .models import CustomOrder, CustomOrderImage
 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from .models import CustomOrder

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings


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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("❌ SERIALIZER ERRORS:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_serializer_context(self):
        # ensures serializer has access to request.FILES
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
    def perform_create(self, serializer):
        order = serializer.save()

        verification_link = self.request.build_absolute_uri(
            reverse(
                "verify-custom-order-email",
                args=[str(order.email_verification_token)]
            )
    )

        html_content = render_to_string(
            "email/verify_custom_order_email.html",
            {
                "name": order.name,
                "verification_link": verification_link,
            }
        )

        email = EmailMultiAlternatives(
            subject="Verify your custom order – Basho by Shivangi",
            body="Please verify your email to confirm your custom order.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[order.email],
        )

        email.attach_alternative(html_content, "text/html")
        email.send()

def verify_custom_order_email(request, token):
    order = get_object_or_404(CustomOrder, email_verification_token=token)

    if order.email_verified:
        return render(
                request,
            "email/email_verified.html",
                {
                    "frontend_url": settings.FRONTEND_URL,
                    "already_verified": True,
                }
            )
    order.email_verified = True
    order.save(update_fields=["email_verified"])

    return render(
        request,
       "email/email_verified.html",
        {
            "frontend_url": settings.FRONTEND_URL,
            "already_verified": False,
        }
    )


