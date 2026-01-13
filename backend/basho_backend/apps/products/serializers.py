from rest_framework import serializers
from .models import Product,CustomOrder,CustomOrderImage

from django.conf import settings
from django.core.mail import send_mail
from django.urls import reverse


class ProductSerializer(serializers.ModelSerializer):
    # Category slug for frontend
    category = serializers.CharField(source="category.slug", read_only=True)

    # CamelCase mappings
    longDescription = serializers.CharField(
        source="long_description", required=False
    )
    isCustomizable = serializers.BooleanField(
        source="is_customizable"
    )

    # Boolean flags
    isFoodSafe = serializers.BooleanField(
        source="is_food_safe"
    )
    isMicrowaveSafe = serializers.BooleanField(
        source="is_microwave_safe"
    )
    isDishwasherSafe = serializers.BooleanField(
        source="is_dishwasher_safe"
    )

    # JSON fields
    images = serializers.JSONField()
    availableColors = serializers.JSONField(
        source="available_colors"
    )
    dimensions = serializers.JSONField(
        required=False
    )
    careInstructions = serializers.JSONField(
        source="care_instructions"
    )
    relatedProducts = serializers.JSONField(
        source="related_products", required=False
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "category",
            "description",
            "longDescription",
            "price",
            "images",
            "availableColors",
            "features",
            "dimensions",
            "materials",
            "careInstructions",
            "isFoodSafe",
            "isMicrowaveSafe",
            "isDishwasherSafe",
            "isCustomizable",
            "stock",
            "weight",
            "featured",
            "relatedProducts",
        ]

class CustomOrderImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomOrderImage
        fields = ["id", "image"]


class CustomOrderSerializer(serializers.ModelSerializer):
    images = CustomOrderImageSerializer(many=True, read_only=True)

    class Meta:
        model = CustomOrder
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "product_type",
            "quantity",
            "dimensions",
            "preferred_colors",
            "timeline",
            "budget_range",
            "description",
            "images",
            "created_at",
        ]

    def validate(self, attrs):
        request = self.context.get("request")
        files = request.FILES.getlist("reference_images") if request else []

        # 🔴 Max image count
        if len(files) > 5:
            raise serializers.ValidationError(
                {"reference_images": "You can upload a maximum of 5 images."}
            )

        # 🔴 File size & type
        for file in files:
            if file.size > 5 * 1024 * 1024:
                raise serializers.ValidationError(
                    {"reference_images": f"{file.name} exceeds 5MB limit."}
                )

            if not file.content_type.startswith("image/"):
                raise serializers.ValidationError(
                    {"reference_images": f"{file.name} is not a valid image."}
                )

        return attrs

    def create(self, validated_data):
        request = self.context.get("request")

        # 1️⃣ Create order FIRST (NO images here)
        order = CustomOrder.objects.create(**validated_data)

        # 2️⃣ Save images separately
        if request and request.FILES:
            for img in request.FILES.getlist("reference_images"):
                CustomOrderImage.objects.create(
                    order=order,
                    image=img
                )
        return order



