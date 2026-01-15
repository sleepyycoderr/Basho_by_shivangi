from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
import razorpay
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
 


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

        slot = serializer.validated_data["slot"]
        people = serializer.validated_data["number_of_people"]
        experience = serializer.validated_data["experience"]

        # 🔒 ATOMIC BLOCK (prevents race conditions)
        with transaction.atomic():
            slot = ExperienceSlot.objects.select_for_update().get(id=slot.id)

            available = slot.total_slots - slot.booked_slots

            if people > available:
                raise ValidationError({
                    "slot": f"Only {available} slots left for this time slot."
                })

            booking = serializer.save(
                status="pending",
                payment_amount=experience.price
            )

            # ✅ Reserve seats
            slot.booked_slots += people
            slot.save()


        # ✅ CREATE RAZORPAY ORDER
        razorpay_order = razorpay_client.order.create({
            "amount": booking.payment_amount * 100,
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

 

razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

class ReleaseExperienceSlotView(APIView):
    def post(self, request):
        booking_id = request.data.get("booking_id")

        if not booking_id:
            return Response(
                {"error": "booking_id required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                booking = Booking.objects.select_for_update().get(id=booking_id)

                # Only release if not confirmed
                if booking.status != "pending":
                    return Response(
                        {"message": "Booking already processed"},
                        status=status.HTTP_200_OK
                    )

                slot = booking.slot
                slot.booked_slots -= booking.number_of_people
                slot.save()


                booking.status = "failed"
                booking.save()

            return Response(
                {"message": "Slot released successfully"},
                status=status.HTTP_200_OK
            )

        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND
            )

class VerifyExperiencePaymentView(APIView):
    def post(self, request):
        data = request.data

        try:
            # 1️⃣ Verify signature
            razorpay_client.utility.verify_payment_signature({
                "razorpay_order_id": data["razorpay_order_id"],
                "razorpay_payment_id": data["razorpay_payment_id"],
                "razorpay_signature": data["razorpay_signature"],
            })

            # 2️⃣ Fetch payment order
            payment_order = PaymentOrder.objects.get(
                razorpay_order_id=data["razorpay_order_id"]
            )

            # 3️⃣ Mark payment as paid
            payment_order.status = "PAID"
            payment_order.razorpay_payment_id = data["razorpay_payment_id"]
            payment_order.save()

            # 4️⃣ Confirm booking
            booking = Booking.objects.get(id=payment_order.linked_object_id)
            booking.status = "confirmed"
            booking.save()

            # 🔍 TEMP DEBUG — add just above send_mail
            print("Experience fields:")
            print(booking.experience._meta.get_fields())

            # 5️⃣ Send email
            if booking.email:
                send_mail(
                    subject="Your Experience Booking is Confirmed 🎉",
                    message=f"""
Hi {booking.full_name},

Your experience booking has been successfully confirmed!

📅  Date: {booking.booking_date}
🎨 Experience: {booking.experience.title}
💰 Amount Paid: ₹{booking.payment_amount}

We look forward to welcoming you ✨

– Team Basho
""",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[booking.email],
                    fail_silently=False,
                )

            return Response({
                "message": "Successfully placed order / booked experience"
            }, status=status.HTTP_200_OK)

        except razorpay.errors.SignatureVerificationError:
            return Response(
                {"error": "Payment verification failed"},
                status=status.HTTP_400_BAD_REQUEST
            )

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

class ListExperienceAvailableDatesView(APIView):
    def get(self, request, experience_id):
        experience = get_object_or_404(
            Experience,
            id=experience_id,
            is_active=True
        )

        # Slots that still have availability
        slots = (
            ExperienceSlot.objects
            .filter(
                experience=experience,
                is_active=True,
                total_slots__gt=F("booked_slots")
            )
            .values_list("date", flat=True)
            .distinct()
            .order_by("date")
        )

        # Convert dates to string (frontend-friendly)
        dates = [d.isoformat() for d in slots]

        return Response(dates, status=status.HTTP_200_OK)

class ListExperienceSlotsByDateView(APIView):
    def get(self, request, experience_id):
        date = request.query_params.get("date")

        if not date:
            return Response(
                {"error": "date query param is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        experience = get_object_or_404(
            Experience,
            id=experience_id,
            is_active=True
        )

        slots = (
            ExperienceSlot.objects
            .filter(
                experience=experience,
                date=date,
                is_active=True
            )
            .order_by("start_time")
        )

        serializer = ExperienceSlotSerializer(slots, many=True)
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
