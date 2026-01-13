from django.contrib import admin
from .models import Product, Category,CustomOrder, CustomOrderImage
from django.urls import path
from django.utils.html import format_html
from .admin_views import send_custom_order_email
from django.urls import reverse

import os
from django.core.mail import send_mail
from django.conf import settings


STATUS_EMAIL_MESSAGES = {
    "reviewed": "Your custom order has been reviewed by our team.",
    "quoted": "Your custom order has been quoted. We will share pricing shortly.",
    "approved": "Your custom order has been approved and will move to production.",
    "completed": "Your custom order has been completed. Thank you for choosing us!",
    "rejected": "Unfortunately, we are unable to proceed with your custom order.",
}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "stock", "featured")
    list_filter = ("category", "featured")
    search_fields = ("name",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}

class CustomOrderImageInline(admin.TabularInline):
    model = CustomOrderImage
    extra = 0
    readonly_fields = ("image",)


@admin.register(CustomOrder)
class CustomOrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "email",
        "email_verified",
        "product_type",
        "status",
        "created_at",
        "send_email_button",
    )

    list_filter = ("email_verified", "status", "product_type", "created_at")
    search_fields = ("name", "email", "phone")

    readonly_fields = (
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
        "created_at",
        "updated_at",
        "email_verified",
        "email_verification_token",

    )

    fieldsets = (
        ("Customer Info", {
            "fields": ("name", "email", "phone")
        }),
        ("Order Details", {
            "fields": (
                "product_type",
                "quantity",
                "dimensions",
                "preferred_colors",
                "timeline",
                "budget_range",
                "description",
            )
        }),
        ("Management (Admin Only)", {
            "fields": ("status", "admin_notes")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at")
        }),
    )

    inlines = [CustomOrderImageInline]
    
    def send_email_button(self, obj):
        if not obj.email_verified:
            return format_html(
                '<span style="color:red;font-weight:600;">{}</span>',"Email not verified"
            )

        return format_html(
            '<a class="button style="text-decoration:none;" href="{}/send-email/">{}</a>', obj.id,"Send Email"
            
        )  
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "<int:order_id>/send-email/",
                self.admin_site.admin_view(send_custom_order_email),
                name="send-custom-order-email",
            ),
        ]
        return custom_urls + urls

    def save_model(self, request, obj, form, change):
        if change:
            old_obj = CustomOrder.objects.get(pk=obj.pk)

            if old_obj.status != obj.status:
                message = STATUS_EMAIL_MESSAGES.get(obj.status)

                if message:
                    send_mail(
                        subject=f"Update on your custom order #{obj.id}",
                        message=message,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[obj.email],
                        fail_silently=False,
                    )

        super().save_model(request, obj, form, change)

    def delete_reference_images(self, request, queryset):
        deleted_files = 0

        for order in queryset:
            for image in order.images.all():
                if image.image:
                    image_path = image.image.path

                    if os.path.isfile(image_path):
                        os.remove(image_path)
                        deleted_files += 1

                    image.delete()

        self.message_user(
            request,
            f"{deleted_files} reference image(s) deleted successfully."
        )

    actions = ["delete_reference_images"]
    delete_reference_images.short_description = "Delete reference images for selected custom orders"

    send_email_button.short_description = "Email Customer"


@admin.register(CustomOrderImage)
class CustomOrderImageAdmin(admin.ModelAdmin):
    list_display = ("order", "image")