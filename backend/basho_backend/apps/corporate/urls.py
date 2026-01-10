from django.urls import path
from .views import corporate_inquiry

urlpatterns = [
    path("corporate-inquiry/", corporate_inquiry),
]
