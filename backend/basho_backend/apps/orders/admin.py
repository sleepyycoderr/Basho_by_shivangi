from django.contrib import admin

from django.contrib import admin
from .models import (
    Cart,
    CartItem,
    PaymentOrder,
    Order,
    OrderItem,
    Payment,
    Transaction,
)

# =========================
# CART
# =========================

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ("product", "quantity")


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "is_active", "created_at")
    list_filter = ("is_active", "created_at")
    search_fields = ("user__email", "user__username")
    readonly_fields = ("created_at",)
    inlines = [CartItemInline]


# =========================
# MASTER PAYMENT ORDER
# =========================

@admin.register(PaymentOrder)
class PaymentOrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order_type",
        "user",
        "amount",
        "status",
        "razorpay_order_id",
        "created_at",
    )
    list_filter = ("order_type", "status", "created_at")
    search_fields = ("razorpay_order_id", "user__email", "user__username")
    readonly_fields = ("created_at",)


# =========================
# PRODUCT ORDER
# =========================

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = (
        "product_name",
        "price",
        "quantity",
        "weight_kg",
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "email",
        "phone",
        "status",
        "total_amount",
        "created_at",
    )
    list_filter = ("status", "created_at", "city")
    search_fields = ("full_name", "email", "phone")
    readonly_fields = ("created_at",)
    inlines = [OrderItemInline]


# =========================
# PAYMENT
# =========================

class TransactionInline(admin.TabularInline):
    model = Transaction
    extra = 0
    readonly_fields = ("event", "response", "created_at")


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "payment_order",
        "razorpay_payment_id",
        "status",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = ("razorpay_payment_id",)
    readonly_fields = ("created_at",)
    inlines = [TransactionInline]


# =========================
# TRANSACTIONS
# =========================

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("id", "payment", "event", "created_at")
    list_filter = ("event", "created_at")
    readonly_fields = ("event", "response", "created_at")