from django.shortcuts import render
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Booking, StudioBooking, UpcomingEvent
from .models import WorkshopRegistration
from .serializers import BookingSerializer, StudioBookingSerializer, UpcomingEventSerializer
from .models import Workshop, WorkshopSlot
from .serializers import WorkshopSerializer, WorkshopSlotSerializer, WorkshopRegistrationSerializer
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from .models import Experience, ExperienceSlot
from .serializers import ExperienceSlotSerializer
import random
from django.utils import timezone
from datetime import timedelta

class CreateBookingView(APIView):
    def post(self, request):
        serializer = BookingSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        booking = serializer.save(
            payment_amount=serializer.validated_data["experience"].price,
            status="pending"
        )

        # Generate OTP
        otp = str(random.randint(100000, 999999))
        booking.otp = otp
        booking.otp_expires_at = timezone.now() + timedelta(minutes=10)
        booking.save()

        # Send OTP email
        try:
            send_mail(
                subject="Confirm your Basho Experience Booking",
                message=(
                    f"Hi {booking.full_name},\n\n"
                    f"Your OTP to confirm your booking is: {otp}\n\n"
                    f"This OTP is valid for 10 minutes.\n\n"
                    f"– Basho Studio"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[booking.email],
                fail_silently=False,
            )
        except Exception as e:
            print("Email sending failed:", e)

        return Response(
            {
                "message": "Booking created. Please verify OTP.",
                "booking_id": booking.id,
            },
            status=status.HTTP_201_CREATED
        )


class ConfirmBookingView(APIView):
    def post(self, request):
        booking_id = request.data.get("booking_id")
        otp = request.data.get("otp")

        booking = get_object_or_404(Booking, id=booking_id)

        # Already confirmed
        if booking.status == "confirmed":
            return Response(
                {"message": "Booking already confirmed"},
                status=status.HTTP_200_OK
            )

        # OTP validation
        if booking.otp != otp:
            return Response(
                {"error": "Invalid OTP"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if timezone.now() > booking.otp_expires_at:
            return Response(
                {"error": "OTP expired"},
                status=status.HTTP_400_BAD_REQUEST
            )

        slot = booking.slot
        people = booking.number_of_people

        # Final capacity check (VERY IMPORTANT)
        remaining = slot.max_participants - slot.booked_participants
        if people > remaining:
            return Response(
                {"error": "Slot no longer has enough spots"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Atomic confirmation
        with transaction.atomic():
            slot.booked_participants += people
            slot.save()

            booking.status = "confirmed"
            booking.save()

        # Send confirmation email
        try:
            send_mail(
                subject="Your Basho Experience is Confirmed ✨",
                message=(
                    f"Hi {booking.full_name},\n\n"
                    f"Your booking has been confirmed.\n\n"
                    f"Experience: {booking.experience.title}\n"
                    f"Date: {slot.date}\n"
                    f"Time: {slot.start_time} - {slot.end_time}\n\n"
                    f"– Basho Studio"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[booking.email],
                fail_silently=False,
            )
        except Exception as e:
            print("Email sending failed:", e)

        return Response(
            {
                "message": "Booking confirmed",
                "booking_id": booking.id,
            },
            status=status.HTTP_200_OK
        )

    
class CreateStudioBookingView(APIView):
    def post(self, request):
        serializer = StudioBookingSerializer(data=request.data)

        if serializer.is_valid():
            booking = serializer.save()

            # Send confirmation email
            try:
                send_mail(
                    subject="Your Studio Visit is Confirmed ✨",
                    message=(
                        f"Hi {booking.full_name},\n\n"
                        f"Your studio visit has been confirmed.\n\n"
                        f"Date: {booking.visit_date}\n"
                        f"Time Slot: {booking.time_slot}\n\n"
                        f"We look forward to seeing you at Basho Studio.\n\n"
                        f"– Basho Studio"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[booking.email],
                    fail_silently=False,
                )
            except Exception as e:
                print("Email sending failed:", e)

            return Response(
                {"message": "Studio booking confirmed"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListUpcomingEventsView(APIView):
    def get(self, request):
        events = UpcomingEvent.objects.all()
        serializer = UpcomingEventSerializer(events, many=True)
        return Response(serializer.data)

class ListWorkshopsView(APIView):
    def get(self, request):
        workshops = Workshop.objects.filter(is_active=True)
        serializer = WorkshopSerializer(workshops, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class WorkshopDetailView(APIView):
    def get(self, request, workshop_id):
        try:
            workshop = Workshop.objects.get(id=workshop_id, is_active=True)
        except Workshop.DoesNotExist:
            return Response(
                {"error": "Workshop not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = WorkshopSerializer(workshop)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ListWorkshopSlotsView(APIView):
    def get(self, request, workshop_id):
        workshop = get_object_or_404(Workshop, id=workshop_id, is_active=True)
        slots = WorkshopSlot.objects.filter(
            workshop=workshop,
            is_available=True
        ).order_by("date", "start_time")

        serializer = WorkshopSlotSerializer(slots, many=True)
        return Response(serializer.data)

class CreateWorkshopRegistrationView(APIView):
    def post(self, request):
        serializer = WorkshopRegistrationSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        slot = serializer.validated_data["slot"]
        participants = serializer.validated_data["number_of_participants"]

        # ❌ Slot not available
        if not slot.is_available:
            return Response(
                {"error": "This slot is no longer available"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ❌ Not enough spots
        if participants > slot.available_spots:
            return Response(
                {
                    "error": "Not enough spots available",
                    "available_spots": slot.available_spots,
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Atomic transaction (VERY IMPORTANT)
        with transaction.atomic():
            registration = serializer.save()
            slot.available_spots -= participants

            if slot.available_spots == 0:
                slot.is_available = False

            slot.save()

        return Response(
            {
                "message": "Workshop registered successfully",
                "registration_id": registration.id,
            },
            status=status.HTTP_201_CREATED
        )    
    
class ListExperienceSlotsView(APIView):
    def get(self, request, experience_id):
        experience = get_object_or_404(Experience, id=experience_id, is_active=True)

        slots = ExperienceSlot.objects.filter(
            experience=experience,
            is_active=True
        ).order_by("date", "start_time")

        serializer = ExperienceSlotSerializer(slots, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
