from rest_framework import serializers
from .models import Booking, Experience, StudioBooking, UpcomingEvent
from .models import Workshop, WorkshopSlot, WorkshopRegistration
from .models import ExperienceSlot

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "id",
            "experience",
            "slot",
            "full_name",
            "phone",
            "email",
            "booking_date",
            "number_of_people",
            "status",
        ]
        read_only_fields = ["status"]

    def validate(self, data):
        slot = data.get("slot")
        people = data.get("number_of_people")

        if not slot:
            raise serializers.ValidationError({
                "slot": "Please select a valid time slot."
            })

        # Check slot active
        if not slot.is_active:
            raise serializers.ValidationError({
                "slot": "This slot is no longer available."
            })

        # Min participants check
        if people < slot.min_participants:
            raise serializers.ValidationError({
                "number_of_people": f"Minimum {slot.min_participants} participants required."
            })

        # Capacity check
        remaining = slot.max_participants - slot.booked_participants
        if people > remaining:
            raise serializers.ValidationError({
                "number_of_people": f"Only {remaining} spots left for this slot."
            })

        return data


class ExperienceSlotSerializer(serializers.ModelSerializer):
    startTime = serializers.TimeField(source="start_time")
    endTime = serializers.TimeField(source="end_time")
    minParticipants = serializers.IntegerField(source="min_participants")
    maxParticipants = serializers.IntegerField(source="max_participants")
    bookedParticipants = serializers.IntegerField(source="booked_participants")

    class Meta:
        model = ExperienceSlot
        fields = [
            "id",
            "date",
            "startTime",
            "endTime",
            "minParticipants",
            "maxParticipants",
            "bookedParticipants",
        ]


class StudioBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudioBooking
        fields = "__all__"

class UpcomingEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = UpcomingEvent
        fields = "__all__"

class WorkshopSlotSerializer(serializers.ModelSerializer):
    startTime = serializers.TimeField(source="start_time")
    endTime = serializers.TimeField(source="end_time")
    availableSpots = serializers.IntegerField(source="available_spots")
    isAvailable = serializers.BooleanField(source="is_available")

    class Meta:
        model = WorkshopSlot
        fields = [
            "id",
            "date",
            "startTime",
            "endTime",
            "availableSpots",
            "isAvailable",
        ]

class WorkshopSerializer(serializers.ModelSerializer):
    participants = serializers.SerializerMethodField()
    schedule = WorkshopSlotSerializer(source="slots", many=True)

    experienceType = serializers.CharField(source="experience_type", allow_null=True)
    longDescription = serializers.CharField(source="long_description")
    pricePerPerson = serializers.BooleanField(source="price_per_person")
    takeHome = serializers.CharField(source="take_home")
    providedMaterials = serializers.JSONField(source="provided_materials")
    lunchIncluded = serializers.BooleanField(source="lunch_included")

    class Meta:
        model = Workshop
        fields = [
            "id",
            "name",
            "type",
            "level",
            "experienceType",
            "description",
            "longDescription",
            "images",
            "duration",
            "participants",
            "price",
            "pricePerPerson",
            "includes",
            "requirements",
            "location",
            "instructor",
            "takeHome",
            "providedMaterials",
            "certificate",
            "lunchIncluded",
            "featured",
            "schedule",
        ]

    def get_participants(self, obj):
        return {
            "min": obj.min_participants,
            "max": obj.max_participants,
        }

class WorkshopRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkshopRegistration
        fields = "__all__"

class ExperienceSerializer(serializers.ModelSerializer):
    slots = ExperienceSlotSerializer(many=True, read_only=True)

    class Meta:
        model = Experience
        fields = [
            "id",
            "title",
            "tagline",
            "description",
            "duration",
            "people",
            "price",
            "image",
            "is_active",
            "slots",
        ]
