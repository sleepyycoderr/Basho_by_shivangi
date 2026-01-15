from django.urls import path
from .views import (
    send_otp,
    register_user,
    login_user,
    google_login,
    google_register,
    change_username,  
    upload_profile_picture, 
    set_profile_picture_from_url,

)

urlpatterns = [
    path("send-otp/", send_otp),
    path("register/", register_user),
    path("login/", login_user),
    path("google-login/", google_login),
    path("google-register/", google_register),
    path("change-username/", change_username),
    path("upload-profile-picture/", upload_profile_picture),
    path("set-profile-picture/", set_profile_picture_from_url),

   

]

from .views import (
    forgot_password_send_otp,
    forgot_password_verify_otp,
    forgot_password_reset,
)

urlpatterns += [
    path("forgot-password/send-otp/", forgot_password_send_otp),
    path("forgot-password/verify-otp/", forgot_password_verify_otp),
    path("forgot-password/reset-password/", forgot_password_reset),
]
