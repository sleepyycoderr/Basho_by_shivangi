from django.db import models

from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator


# =========================
# CART (ONLY FOR PRODUCTS)
# =========================

class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def total_weight(self):
        return sum(item.product.weight * item.quantity for item in self.items.all())

    def total_price(self):
        return sum(item.product.price * item.quantity for item in self.items.all())

    def __str__(self):
        return f"Cart {self.id} - {self.user}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.product.name} ({self.quantity})"


# ==================================
# MASTER PAYMENT ORDER (ALL MODULES)
# ==================================

class PaymentOrder(models.Model):

    TYPE = (
        ("PRODUCT", "Product"),
        ("WORKSHOP", "Workshop"),
        ("EXPERIENCE", "Experience"),
        ("CUSTOM", "Custom"),
    )

    STATUS = (
        ("PENDING", "Pending"),
        ("PAID", "Paid"),
        ("FAILED", "Failed"),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    order_type = models.CharField(max_length=20, choices=TYPE)

    linked_object_id = models.PositiveIntegerField(null=True, blank=True)
    linked_app = models.CharField(max_length=50, blank=True)

    amount = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS, default="PENDING")

    razorpay_order_id = models.CharField(max_length=200, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.order_type} - {self.id} - {self.status}"


# ==================================
# PRODUCT ORDER
# ==================================

class Order(models.Model):

    STATUS_CHOICES = (
        ("created", "Created"),
        ("paid", "Paid"),
        ("failed", "Failed"),
    )

    payment_order = models.OneToOneField(
        PaymentOrder,
        on_delete=models.CASCADE,
        related_name="product_order"
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="created")

    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    address = models.TextField()
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)

    gst_number = models.CharField(max_length=20, blank=True, null=True)

    subtotal = models.FloatField()
    shipping_cost = models.FloatField()
    total_weight = models.FloatField()
    total_amount = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.full_name}"


class OrderItem(models.Model):

    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey("products.Product", on_delete=models.SET_NULL, null=True)

    product_name = models.CharField(max_length=200)
    price = models.FloatField()
    quantity = models.PositiveIntegerField()
    weight_kg = models.FloatField()

    def total_price(self):
        return self.price * self.quantity

    def __str__(self):
        return f"{self.product_name} ({self.quantity})"


# =========================
# PAYMENT & TRANSACTIONS
# =========================

class Payment(models.Model):

    payment_order = models.OneToOneField(
        PaymentOrder,
        on_delete=models.CASCADE,
        related_name="payment"
    )

    razorpay_payment_id = models.CharField(max_length=200, blank=True, null=True)
    razorpay_signature = models.TextField(blank=True, null=True)

    status = models.CharField(max_length=50, default="created")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.id} - {self.status}"


class Transaction(models.Model):

    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name="transactions")
    event = models.CharField(max_length=100)
    response = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.event} - {self.id}"