from django.shortcuts import get_object_or_404, redirect, render
from django.core.mail import send_mail
from django.contrib import messages
from django.conf import settings

from .models import CustomOrder, CustomOrderEmailLog
from .admin_email import SendEmailForm
from django.urls import reverse

def send_custom_order_email(request, order_id):

    if not request.user.is_staff:
        messages.error(request, "You are not authorized.")
        return redirect("/admin/")

    order = get_object_or_404(CustomOrder, id=order_id)

    if request.method == "POST":
        form = SendEmailForm(request.POST)
        if form.is_valid():
            subject = form.cleaned_data["subject"]
            message = form.cleaned_data["message"]

            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [order.email],
                fail_silently=False,
            )

            # Log email
            CustomOrderEmailLog.objects.create(
                order=order,
                subject=subject,
                message=message,
            )

            messages.success(request, "Email sent to customer successfully.")
            return redirect(
            reverse("admin:products_customorder_change", args=[order.id])
            )
            
    else:
        form = SendEmailForm(
            initial={
                "subject": f"Regarding your custom order #{order.id}",
            }
        )

    return render(
        request,
        "admin/send_custom_order_email.html",
        {"form": form, "order": order},
    )
