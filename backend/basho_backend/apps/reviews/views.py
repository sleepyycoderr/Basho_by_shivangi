from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import Review


# ✅ GET approved reviews (PUBLIC)
@api_view(["GET"])
@permission_classes([AllowAny])
def list_reviews(request):
    reviews = Review.objects.filter(is_approved=True).order_by("-created_at")

    data = []
    for r in reviews:
        data.append({
            "id": r.id,
            "name": r.name,
            "city": r.city,
            "rating": r.rating,
            "message": r.message,
            "created_at": r.created_at,
        })

    return Response(data, status=status.HTTP_200_OK)


# ✅ POST review (LOGGED-IN USERS)
@api_view(["POST"])
@permission_classes([AllowAny])
def create_review(request):
    data = request.data

    Review.objects.create(
        user=request.user if request.user.is_authenticated else None,

        name=data.get("name"),
        city=data.get("city"),
        rating=data.get("rating"),
        message=data.get("message"),
        is_approved=False,  # admin must approve
    )

    return Response(
        {"message": "Review submitted for approval"},
        status=status.HTTP_201_CREATED,
    )
