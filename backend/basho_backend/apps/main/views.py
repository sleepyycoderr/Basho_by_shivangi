from datetime import date, timedelta
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from django.shortcuts import render
from django.contrib.auth.decorators import user_passes_test

from apps.orders.models import Order, PaymentOrder
from apps.products.models import Product, CustomOrder
from apps.experiences.models import (
    Booking,
    WorkshopRegistration,
    StudioBooking,
)
from apps.corporate.models import CorporateInquiry


def is_admin(user):
    return user.is_authenticated and user.is_staff


@user_passes_test(is_admin, login_url="/admin/login/")
def home(request):
    today = date.today()
    last_30_days = today - timedelta(days=30)

    # =======================
    # 💰 REVENUE ANALYTICS
    # =======================

    total_revenue = PaymentOrder.objects.filter(
        status="PAID"
    ).aggregate(total=Sum("amount"))["total"] or 0

    monthly_revenue = PaymentOrder.objects.filter(
        status="PAID",
        created_at__date__gte=last_30_days
    ).aggregate(total=Sum("amount"))["total"] or 0

    # =======================
    # 📦 PRODUCT ANALYTICS
    # =======================

    total_products = Product.objects.count()
    low_stock_products = Product.objects.filter(stock__lte=5).count()

    total_orders = Order.objects.count()
    orders_today = Order.objects.filter(created_at__date=today).count()

    # =======================
    # 🏺 EXPERIENCE & WORKSHOPS
    # =======================

    experience_bookings = Booking.objects.filter(status="confirmed").count()
    workshop_registrations = WorkshopRegistration.objects.filter(status="confirmed").count()
    studio_visits = StudioBooking.objects.count()

    # =======================
    # 🧾 CUSTOM & CORPORATE
    # =======================

    custom_orders = CustomOrder.objects.count()
    pending_custom_orders = CustomOrder.objects.filter(status="pending").count()

    corporate_inquiries = CorporateInquiry.objects.count()

    # =======================
    # 📈 REVENUE GRAPH (30 days)
    # =======================

    revenue_chart = (
        PaymentOrder.objects
        .filter(status="PAID", created_at__date__gte=last_30_days)
        .annotate(day=TruncDate("created_at"))
        .values("day")
        .annotate(total=Sum("amount"))
        .order_by("day")
    )

    revenue_labels = [str(r["day"]) for r in revenue_chart]
    revenue_values = [float(r["total"]) for r in revenue_chart]

    context = {
        # money
        "total_revenue": round(total_revenue, 2),
        "monthly_revenue": round(monthly_revenue, 2),

        # products
        "total_products": total_products,
        "low_stock_products": low_stock_products,
        "total_orders": total_orders,
        "orders_today": orders_today,

        # experiences
        "experience_bookings": experience_bookings,
        "workshop_registrations": workshop_registrations,
        "studio_visits": studio_visits,

        # custom & corporate
        "custom_orders": custom_orders,
        "pending_custom_orders": pending_custom_orders,
        "corporate_inquiries": corporate_inquiries,

        # charts
        "revenue_labels": revenue_labels,
        "revenue_values": revenue_values,
    }

    return render(request, "main/home.html", context)
