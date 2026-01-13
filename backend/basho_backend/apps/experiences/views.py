from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
import razorpay
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from apps.orders.models import PaymentOrder
from .models import (
    Booking,
    StudioBooking,
    UpcomingEvent,
    Workshop,
    WorkshopSlot,
    WorkshopRegistration,
    Experience,
    ExperienceSlot,
)
from .serializers import (
    BookingSerializer,
    StudioBookingSerializer,
    UpcomingEventSerializer,
    WorkshopSerializer,
    WorkshopSlotSerializer,
    WorkshopRegistrationSerializer,
    ExperienceSlotSerializer,
    ExperienceSerializer,   # ✅ ADD THIS
)

razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

# =========================
# EXPERIENCE BOOKING (PAYMENT FIRST)
# =========================

class CreateBookingView(APIView):
    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        booking = serializer.save(
            status="pending",
            payment_amount=serializer.validated_data["experience"].price
        )

        # ✅ CREATE RAZORPAY ORDER
        razorpay_order = razorpay_client.order.create({
            "amount": booking.payment_amount * 100,  # paise
            "currency": "INR",
            "payment_capture": 1
        })

        payment_order = PaymentOrder.objects.create(
            user=request.user if request.user.is_authenticated else None,
            order_type="EXPERIENCE",
            linked_object_id=booking.id,
            linked_app="experiences",
            amount=booking.payment_amount,
            razorpay_order_id=razorpay_order["id"],
        )

        booking.payment_order = payment_order
        booking.save()

        return Response({
            "booking_id": booking.id,
            "razorpay_order_id": payment_order.razorpay_order_id,
            "amount": payment_order.amount,
        }, status=status.HTTP_201_CREATED)


# =========================
# STUDIO BOOKING (NO PAYMENT)
# =========================
@method_decorator(csrf_exempt, name="dispatch")
class CreateStudioBookingView(APIView):
    def post(self, request):
        serializer = StudioBookingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        booking = serializer.save()

        try:
            send_mail(
                subject="Your Studio Visit is Confirmed ✨",
                message=(
                    f"Hi {booking.full_name},\n\n"
                    f"Your studio visit has been confirmed.\n\n"
                    f"Date: {booking.visit_date}\n"
                    f"Time Slot: {booking.time_slot}\n\n"
                    f"– Basho Studio"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[booking.email],
                fail_silently=True,  # 🔥 THIS IS THE KEY
            )
        except Exception as e:
            print("⚠️ Studio email failed:", str(e))


        return Response(
            {"message": "Studio booking confirmed"},
            status=status.HTTP_201_CREATED
        )


# =========================
# LISTING VIEWS
# =========================

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
        workshop = get_object_or_404(Workshop, id=workshop_id, is_active=True)
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


class ListExperienceSlotsView(APIView):
    def get(self, request, experience_id):
        experience = get_object_or_404(Experience, id=experience_id, is_active=True)
        slots = ExperienceSlot.objects.filter(
            experience=experience,
            is_active=True
        ).order_by("date", "start_time")

        serializer = ExperienceSlotSerializer(slots, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ListExperiencesView(APIView):
    def get(self, request):
        experiences = Experience.objects.filter(is_active=True)
        serializer = ExperienceSerializer(experiences, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# =========================
# WORKSHOP REGISTRATION (PAYMENT FIRST)
# =========================

class CreateWorkshopRegistrationView(APIView):
    def post(self, request):
        serializer = WorkshopRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        registration = serializer.save(status="pending")

        amount = (
            registration.workshop.price * registration.number_of_participants
            if registration.workshop.price_per_person
            else registration.workshop.price
        )

        razorpay_order = razorpay_client.order.create({
            "amount": amount * 100,  # paise
            "currency": "INR",
            "payment_capture": 1
        })

        payment_order = PaymentOrder.objects.create(
            user=request.user if request.user.is_authenticated else None,
            order_type="WORKSHOP",
            linked_object_id=registration.id,
            linked_app="experiences",
            amount=amount,
            razorpay_order_id=razorpay_order["id"],
        )

        registration.payment_order = payment_order
        registration.save()

        return Response(
            {
                "registration_id": registration.id,
                "razorpay_order_id": payment_order.razorpay_order_id,
                "amount": amount,
            },
            status=status.HTTP_201_CREATED
        )
