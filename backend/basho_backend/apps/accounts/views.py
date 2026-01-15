from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
from datetime import timedelta
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string
import re

from .models import User, EmailOTP
from .otp import generate_otp
from .services import send_otp_email, send_welcome_email


# ---------------- HELPERS ----------------

def is_strong_password(password):
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[^A-Za-z0-9]", password):
        return False
    return True


# ---------------- AUTH ----------------

@api_view(["POST"])
def send_otp(request):
    email = request.data.get("email")
    username = request.data.get("username")

    if not email or not username:
        return Response({"error": "Email and username required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already registered"}, status=400)

    otp = generate_otp()

    EmailOTP.objects.update_or_create(
        email=email,
        defaults={"otp": otp, "created_at": timezone.now()}
    )

    send_otp_email(email, otp)
    return Response({"success": "OTP sent"})


@api_view(["POST"])
def register_user(request):
    email = request.data.get("email")
    username = request.data.get("username")
    password = request.data.get("password")
    otp = request.data.get("otp")

    if not all([email, username, password, otp]):
        return Response({"error": "All fields are required"}, status=400)

    otp_obj = EmailOTP.objects.filter(email=email, otp=otp).first()
    if not otp_obj:
        return Response({"error": "Incorrect OTP"}, status=400)

    if timezone.now() - otp_obj.created_at > timedelta(minutes=5):
        otp_obj.delete()
        return Response({"error": "OTP expired"}, status=400)

    if not is_strong_password(password):
        return Response(
            {"error": "Password must be at least 8 characters, include 1 uppercase letter and 1 special character"},
            status=400
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    user.is_email_verified = True
    user.save()

    send_welcome_email(email, username)
    otp_obj.delete()

    refresh = RefreshToken.for_user(user)

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "username": user.username,
    })


@api_view(["POST"])
def login_user(request):
    user = authenticate(
        username=request.data.get("username"),
        password=request.data.get("password")
    )

    if not user:
        return Response({"error": "Incorrect username or password"}, status=400)

    refresh = RefreshToken.for_user(user)

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "username": user.username,
        "email": user.email,
        "profile_image": user.profile_image.url if user.profile_image else None,
    })


@api_view(["POST"])
def google_login(request):
    email = request.data.get("email")
    user = User.objects.filter(email=email).first()

    if not user:
        return Response({"error": "Account not found. Please register first."}, status=400)

    refresh = RefreshToken.for_user(user)

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "username": user.username,
        "email": user.email,
        "profile_image": user.profile_image.url if user.profile_image else None,
    })


@api_view(["POST"])
def google_register(request):
    email = request.data.get("email")
    username = request.data.get("username")

    password = get_random_string(12)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    user.is_email_verified = True
    user.save()

    refresh = RefreshToken.for_user(user)

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "username": user.username,
    })


# ---------------- CHANGE USERNAME (UNCHANGED LOGIC) ----------------

@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_username(request):
    user = request.user
    new_username = request.data.get("username", "").strip()

    if not new_username:
        return Response({"error": "Username cannot be empty"}, status=400)

    if User.objects.filter(username=new_username).exclude(id=user.id).exists():
        return Response({"error": "Username already taken"}, status=400)

    user.username = new_username
    user.save(update_fields=["username"])

    return Response({"username": user.username})


# ---------------- PROFILE PICTURE ----------------

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def upload_profile_picture(request):
    user = request.user
    image = request.FILES.get("image")

    if not image:
        return Response({"error": "No image provided"}, status=400)

    user.profile_image = image
    user.save()

    return Response({"profile_image": user.profile_image.url})


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def set_profile_picture_from_url(request):
    user = request.user
    image_url = request.data.get("image_url")

    if not image_url:
        return Response({"error": "Image URL required"}, status=400)

    user.profile_image = image_url.replace("http://127.0.0.1:8000/media/", "")
    user.save(update_fields=["profile_image"])

    return Response({"profile_image": user.profile_image.url})


# ---------------- FORGOT PASSWORD ----------------

@api_view(["POST"])
def forgot_password_send_otp(request):
    email = request.data.get("email")
    user = User.objects.filter(email=email).first()

    if not user:
        return Response({"error": "Incorrect email id entered"}, status=400)

    otp = generate_otp()
    EmailOTP.objects.update_or_create(
        email=email,
        defaults={"otp": otp, "created_at": timezone.now()}
    )

    send_otp_email(email, otp)
    return Response({"success": "OTP sent"})


@api_view(["POST"])
def forgot_password_verify_otp(request):
    email = request.data.get("email")
    otp = request.data.get("otp")

    otp_obj = EmailOTP.objects.filter(email=email, otp=otp).first()
    if not otp_obj:
        return Response({"error": "Incorrect OTP entered"}, status=400)

    if timezone.now() - otp_obj.created_at > timedelta(minutes=5):
        otp_obj.delete()
        return Response({"error": "OTP expired"}, status=400)

    return Response({"success": "OTP verified"})


@api_view(["POST"])
def forgot_password_reset(request):
    email = request.data.get("email")
    new_password = request.data.get("new_password")
    confirm_password = request.data.get("confirm_password")

    if new_password != confirm_password:
        return Response({"error": "Passwords do not match"}, status=400)

    if not is_strong_password(new_password):
        return Response({"error": "Password must be strong"}, status=400)

    user = User.objects.filter(email=email).first()
    user.set_password(new_password)
    user.save()

    EmailOTP.objects.filter(email=email).delete()
    return Response({"success": "Password reset successful"})
