from django.db import models


class CorporateInquiry(models.Model):
    SERVICE_CHOICES = [
        ("Corporate Gifting", "Corporate Gifting"),
        ("Team Workshop", "Team Workshop"),
        ("Brand Collaboration", "Brand Collaboration"),
    ]

    company_name = models.CharField(max_length=255)
    company_website = models.URLField(blank=True)

    contact_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)

    service_type = models.CharField(
        max_length=50,
        choices=SERVICE_CHOICES
    )

    # dynamic form data stored safely
    details = models.JSONField(default=dict, blank=True)

    message = models.TextField(blank=True)
    budget = models.CharField(max_length=100, blank=True)
    timeline = models.CharField(max_length=100, blank=True)

    consent = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.company_name} | {self.service_type}"
    
    class Meta:
        ordering = ["-created_at"]

