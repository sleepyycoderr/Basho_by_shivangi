from django.urls import path
from .views import (
    CreateBookingView,
    CreateStudioBookingView,
    ListUpcomingEventsView,
    ListWorkshopsView,
    WorkshopDetailView,
    ListWorkshopSlotsView,
    CreateWorkshopRegistrationView,
    ListExperienceSlotsView,
    ListExperiencesView,   # ✅ ADD THIS
)



urlpatterns = [
    # Experiences
    path("book/", CreateBookingView.as_view(), name="create-booking"),
    #path("book/confirm/", ConfirmBookingView.as_view(), name="confirm-booking"),
    path(
        "<int:experience_id>/slots/",
        ListExperienceSlotsView.as_view(),
        name="experience-slots",
    ),
    path("", ListExperiencesView.as_view(), name="list-experiences"),


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
