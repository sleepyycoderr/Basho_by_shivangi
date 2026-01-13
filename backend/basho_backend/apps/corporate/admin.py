from django.contrib import admin
from .models import CorporateInquiry


@admin.register(CorporateInquiry)
class CorporateInquiryAdmin(admin.ModelAdmin):
    """
    Read-only Admin for Corporate Inquiries
    """

    # ✅ Show fields in list view
    list_display = (
        "company_name",
        "contact_name",
        "email",
        "service_type",
        "created_at",
    )

    # ✅ Allow searching
    search_fields = (
        "company_name",
        "contact_name",
        "email",
    )

    # ✅ Filters on right sidebar
    list_filter = (
        "service_type",
        "created_at",
    )

    # 🔒 Make ALL fields read-only
    readonly_fields = [field.name for field in CorporateInquiry._meta.fields]

    # ❌ Disable ADD permission
    def has_add_permission(self, request):
        return False

    # ❌ Disable DELETE permission
    def has_delete_permission(self, request, obj=None):
        return False

    # ❌ Disable EDIT (save) permission
    def has_change_permission(self, request, obj=None):
        # Allow viewing but not editing
        if request.method in ["GET", "HEAD"]:
            return True
        return False
