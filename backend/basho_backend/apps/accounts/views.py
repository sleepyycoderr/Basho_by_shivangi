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


import os
from django.core.files import File
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt



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
        "avatar": user.avatar,

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
        "avatar": user.avatar,

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
def set_avatar(request):
    user = request.user
    avatar = request.data.get("avatar")

    if not avatar:
        return Response({"error": "Avatar is required"}, status=400)

    # optional safety check
    allowed_avatars = [
        "p1.png", "p2.png", "p3.png", "p4.png", "p5.png",
        "p6.png", "p7.png", "p8.png", "p9.png", "p10.png",
        "p11.png", "p12.png", "p13.png", "p14.png",
        "p15.png", "p16.png", "p17.png",
    ]

    if avatar not in allowed_avatars:
        return Response({"error": "Invalid avatar"}, status=400)

    user.avatar = avatar
    user.save(update_fields=["avatar"])

    return Response({
        "avatar": user.avatar
    })


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    return Response({
        "username": user.username,
        "email": user.email,
        "avatar": user.avatar,

    })



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
