 # Create your models here.
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)  # tableware, decor, custom
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    id = models.CharField(
        max_length=100,
        primary_key=True
    )  # matches frontend slug like "ceremonial-tea-bowl-001"

    name = models.CharField(max_length=255)
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="products"
    )

    description = models.TextField()
    long_description = models.TextField(blank=True, null=True)

    price = models.PositiveIntegerField()
    stock = models.PositiveIntegerField()
    weight = models.FloatField(help_text="Weight in KG")

    featured = models.BooleanField(default=False)
    is_customizable = models.BooleanField(default=False)

    # JSON fields (PostgreSQL only)
    images = models.JSONField(default=list)
    available_colors = models.JSONField(default=list)
    features = models.JSONField(default=list)
    materials = models.JSONField(default=list)
    care_instructions = models.JSONField(default=list)
    dimensions = models.JSONField(blank=True, null=True)
    related_products = models.JSONField(blank=True, null=True)

    is_food_safe = models.BooleanField(default=True)
    is_microwave_safe = models.BooleanField(default=False)
    is_dishwasher_safe = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class CustomOrder(models.Model):
    PRODUCT_TYPE_CHOICES = [
        ("cups_mugs", "Cups & Mugs"),
        ("bowls", "Bowls"),
        ("plates", "Plates"),
        ("vases", "Vases"),
        ("decorative", "Decorative pieces"),
        ("other", "Other"),
    ]
    STATUS_CHOICES = [
    ("pending", "Pending"),
    ("reviewed", "Reviewed"),
    ("quoted", "Quoted"),
    ("approved", "Approved"),
    ("rejected", "Rejected"),
    ]

 

    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)


    product_type = models.CharField(
        max_length=50,
        choices=PRODUCT_TYPE_CHOICES
    )

    quantity = models.PositiveIntegerField(default=1)
    dimensions = models.CharField(max_length=100, blank=True)
    preferred_colors = models.CharField(max_length=100, blank=True)
    timeline = models.CharField(max_length=100, blank=True)
    budget_range = models.CharField(max_length=100, blank=True)

    description = models.TextField()

      
    admin_notes = models.TextField(
        blank=True,
        help_text="Internal notes for admin only"
    )

    #  Order management
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.product_type}"
    
class CustomOrderImage(models.Model):
    order = models.ForeignKey(
        CustomOrder,
        related_name="images",
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="custom_orders/")

    def __str__(self):
        return f"Image for Order {self.order.id}"

class CustomOrderEmailLog(models.Model):
    order = models.ForeignKey(
        CustomOrder,
        related_name="email_logs",
        on_delete=models.CASCADE
    )
    subject = models.CharField(max_length=255)
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Email for Order {self.order.id} at {self.sent_at}"
