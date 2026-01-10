from django.urls import path
from .views import (
    send_otp,
    register_user,
    login_user,
    google_login,
    google_register,
    change_username,  
    upload_profile_picture, 
    change_password,

)



urlpatterns = [
    path("send-otp/", send_otp),
    path("register/", register_user),
    path("login/", login_user),
    path("google-login/", google_login),
    path("google-register/", google_register),
    path("change-username/", change_username),
    path("upload-profile-picture/", upload_profile_picture),
    path("change-password/", change_password),


]
