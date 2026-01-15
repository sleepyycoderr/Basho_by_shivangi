from django.db import models
from django.conf import settings


class Review(models.Model):
    user = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name="reviews",
    null=True,
    blank=True
)


    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100)

    # Rating: 0.5 → 5 (half stars allowed)
    rating = models.DecimalField(
        max_digits=2,
        decimal_places=1
    )

    message = models.TextField()

    # Admin approval
    is_approved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.rating}★)"
