from django.contrib import admin
from .models import CorporateInquiry

@admin.register(CorporateInquiry)
class CorporateInquiryAdmin(admin.ModelAdmin):
    list_display = (
        "company_name",
        "contact_name",
        "email",
        "service_type",
        "created_at",
    )
    list_filter = ("service_type", "created_at")
    search_fields = ("company_name", "email", "contact_name")
