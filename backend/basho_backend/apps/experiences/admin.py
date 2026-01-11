from django.contrib import admin
from .models import (
    Experience,
    Booking,
    StudioBooking,
    UpcomingEvent,
    Workshop,
    WorkshopSlot,
    WorkshopRegistration,
    ExperienceSlot,
)

# ---------- BASIC MODELS ----------
@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ("title", "price", "is_active")
    list_filter = ("is_active",)
    search_fields = ("title",)

@admin.register(ExperienceSlot)
class ExperienceSlotAdmin(admin.ModelAdmin):
    list_display = (
        "experience",
        "date",
        "start_time",
        "end_time",
        "min_participants",
        "max_participants",
        "booked_participants",
        "is_active",
    )

    list_filter = ("experience", "date", "is_active")
    search_fields = ("experience__title",)
    ordering = ("date", "start_time")

    readonly_fields = ("booked_participants",)


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("full_name", "experience", "status", "payment_status")
    list_filter = ("status", "payment_status")
    search_fields = ("full_name", "email")


@admin.register(StudioBooking)
class StudioBookingAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "phone", "visit_date", "time_slot", "created_at")
    search_fields = ("full_name", "email", "phone")


@admin.register(UpcomingEvent)
class UpcomingEventAdmin(admin.ModelAdmin):
    list_display = ("title", "date", "location")
    search_fields = ("title",)


# ---------- WORKSHOPS ----------
@admin.register(Workshop)
class WorkshopAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "type",
        "level",
        "price",
        "featured",
        "is_active",
    )
    list_filter = ("type", "level", "featured", "is_active")
    search_fields = ("name", "description", "instructor")


@admin.register(WorkshopSlot)
class WorkshopSlotAdmin(admin.ModelAdmin):
    list_display = (
        "workshop",
        "date",
        "start_time",
        "end_time",
        "available_spots",
        "is_available",
    )
    list_filter = ("date", "is_available")


@admin.register(WorkshopRegistration)
class WorkshopRegistrationAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "workshop",
        "slot",
        "number_of_participants",
        "created_at",
    )
    list_filter = ("workshop", "created_at")
    search_fields = ("name", "email", "phone")