from django.urls import path
from .views import (
    CreateBookingView,
    CreateStudioBookingView,
    ListUpcomingEventsView,
    ListWorkshopsView,
    ReleaseExperienceSlotView,
    WorkshopDetailView,
    ListWorkshopSlotsView,
    CreateWorkshopRegistrationView,
    ListExperienceSlotsView,
    ListExperiencesView,
    ListExperienceAvailableDatesView,
    ListExperienceSlotsByDateView,
    VerifyExperiencePaymentView  # ✅ ADD THIS
)



urlpatterns = [
    # Experiences
    path("book/", CreateBookingView.as_view(), name="create-booking"),
    path("verify-payment/", VerifyExperiencePaymentView.as_view()),
    #path("book/confirm/", ConfirmBookingView.as_view(), name="confirm-booking"),
    path(
        "<int:experience_id>/slots/",
        ListExperienceSlotsView.as_view(),
        name="experience-slots",
    ),
    path("", ListExperiencesView.as_view(), name="list-experiences"),
    path("release-slot/", ReleaseExperienceSlotView.as_view()),
    path("<int:experience_id>/available-dates/", ListExperienceAvailableDatesView.as_view(), name="experience-available-dates"),
    path("<int:experience_id>/slots-by-date/", ListExperienceSlotsByDateView.as_view(), name="experience-slots-by-date"),
    path(
    "<int:experience_id>/available-dates/",
    ListExperienceAvailableDatesView.as_view(),),

    path(
        "<int:experience_id>/slots-by-date/",
        ListExperienceSlotsByDateView.as_view(),
    ),
    # Studio
    path("studio-book/", CreateStudioBookingView.as_view(), name="create-studio-booking"),

    # Events
    path("events/", ListUpcomingEventsView.as_view(), name="list-upcoming-events"),

    # Workshops (UNCHANGED)
    path("workshops/", ListWorkshopsView.as_view(), name="list-workshops"),
    path("workshops/<int:workshop_id>/", WorkshopDetailView.as_view(), name="workshop-detail"),
    path(
        "workshops/<int:workshop_id>/slots/",
        ListWorkshopSlotsView.as_view(),
        name="workshop-slots",
    ),
    path(
        "workshops/register/",
        CreateWorkshopRegistrationView.as_view(),
        name="workshop-register",
    ),
]
