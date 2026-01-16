from django.urls import path
from .views import (
    send_otp,
    register_user,
    login_user,
    google_login,
    google_register,
    change_username,  
    me,
    set_avatar,

)

urlpatterns = [
    path("send-otp/", send_otp),
    path("register/", register_user),
    path("login/", login_user),
    path("google-login/", google_login),
    path("google-register/", google_register),
    path("change-username/", change_username),
    path("me/", me),
    path("set-avatar/", set_avatar),
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
