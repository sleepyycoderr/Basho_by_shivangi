from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import CorporateInquiry


@api_view(["POST"])
def corporate_inquiry(request):
    data = request.data

    # 🔒 REQUIRED FIELDS CHECK
    required_fields = [
        "companyName",
        "contactName",
        "email",
        "serviceType",
        "consent",
    ]

    for field in required_fields:
        if not data.get(field):
            return Response(
                {"error": f"{field} is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    # ✅ Extract dynamic service-specific fields safely
    details = data.copy()

    for key in [
        "companyName",
        "companyWebsite",
        "contactName",
        "email",
        "phone",
        "serviceType",
        "message",
        "budget",
        "timeline",
        "consent",
    ]:
        details.pop(key, None)

    inquiry = CorporateInquiry.objects.create(
        company_name=data["companyName"],
        company_website=data.get("companyWebsite", ""),
        contact_name=data["contactName"],
        email=data["email"],
        phone=data.get("phone", ""),
        service_type=data["serviceType"],
        details=details,
        message=data.get("message", ""),
        budget=data.get("budget", ""),
        timeline=data.get("timeline", ""),
        consent=bool(data.get("consent")),
    )

    return Response(
        {
            "success": True,
            "id": inquiry.id,
            "message": "Inquiry submitted successfully",
        },
        status=status.HTTP_201_CREATED,
    )
