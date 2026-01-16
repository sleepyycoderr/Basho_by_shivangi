from django.db import models
from django.core.exceptions import ValidationError

class Experience(models.Model):
    title = models.CharField(max_length=200)
    tagline = models.CharField(max_length=200)
    description = models.TextField()
    duration = models.CharField(max_length=50)
    people = models.CharField(max_length=50)

    min_participants = models.PositiveIntegerField(null=True, blank=True)
    max_participants = models.PositiveIntegerField(null=True, blank=True)

    price = models.IntegerField()
    image = models.ImageField(upload_to="experiences/")
    is_active = models.BooleanField(default=True)


    def __str__(self):
        return self.title

class ExperienceSlot(models.Model):
    experience = models.ForeignKey(
        Experience,
        on_delete=models.CASCADE,
        related_name="slots"
    )

    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    total_slots = models.PositiveIntegerField()
    booked_slots = models.PositiveIntegerField(default=0)

    is_active = models.BooleanField(default=True)

    def clean(self):
        if self.start_time >= self.end_time:
            raise ValidationError("Start time must be before end time.")

        if self.booked_slots > self.total_slots:
            raise ValidationError("Booked slots cannot exceed total slots.")

        exp = self.experience
        if exp.min_participants and exp.max_participants:
            if exp.min_participants > exp.max_participants:
                raise ValidationError(
                    "Experience min participants cannot exceed max participants."
                )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)    

    def __str__(self):
        return f"{self.experience.title} | {self.date} {self.start_time}-{self.end_time}"
    
    class Meta:
        ordering = ["date", "start_time"]

class Booking(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("failed", "Failed"),
    )

    experience = models.ForeignKey(
        Experience,
        on_delete=models.CASCADE,
        related_name="bookings"
    )

    slot = models.ForeignKey(
    ExperienceSlot,
    on_delete=models.PROTECT,
    related_name="bookings",
    null=True,
    blank=True,
)


    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.EmailField()

    booking_date = models.DateField()
    number_of_people = models.PositiveIntegerField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    payment_amount = models.PositiveIntegerField()

    # 🔗 LINK TO ORDERS APP
    payment_order = models.OneToOneField(
        "orders.PaymentOrder",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="experience_booking"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.experience.title}"
   
class StudioBooking(models.Model):
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    visit_date = models.DateField()
    time_slot = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.visit_date} ({self.time_slot})"

class UpcomingEvent(models.Model):
    title = models.CharField(max_length=200)
    date = models.CharField(max_length=50)  # simple string for now
    location = models.CharField(max_length=200)
    description = models.TextField()
    badge = models.CharField(max_length=50, default="✨ Upcoming")

    def __str__(self):
        return self.title

class Workshop(models.Model):
    WORKSHOP_TYPE_CHOICES = [
        ("group", "Group"),
        ("private", "Private"),
        ("experience", "Experience"),
    ]

    LEVEL_CHOICES = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("advanced", "Advanced"),
    ]

    EXPERIENCE_TYPE_CHOICES = [
        ("couples_date", "Couple’s Date"),
        ("birthday_party", "Birthday Party"),
        ("corporate", "Corporate"),
        ("masterclass", "Masterclass"),
    ]

    name = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=WORKSHOP_TYPE_CHOICES)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    experience_type = models.CharField(
        max_length=30,
        choices=EXPERIENCE_TYPE_CHOICES,
        blank=True,
        null=True
    )

    description = models.TextField()
    long_description = models.TextField()

    images = models.JSONField(default=list)

    duration = models.CharField(max_length=50)

    min_participants = models.PositiveIntegerField()
    max_participants = models.PositiveIntegerField()

    price = models.PositiveIntegerField()
    price_per_person = models.BooleanField(default=True)

    includes = models.JSONField(default=list)
    requirements = models.JSONField(blank=True, null=True)
    provided_materials = models.JSONField(default=list)

    location = models.CharField(max_length=200)
    instructor = models.CharField(max_length=100)
    take_home = models.CharField(max_length=200)

    certificate = models.BooleanField(default=False)
    lunch_included = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class WorkshopSlot(models.Model):
    workshop = models.ForeignKey(
        Workshop,
        on_delete=models.CASCADE,
        related_name="slots"
    )

    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    available_spots = models.PositiveIntegerField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.workshop.name} | {self.date} {self.start_time}"

class WorkshopRegistration(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("failed", "Failed"),
    )

    workshop = models.ForeignKey(
        Workshop,
        on_delete=models.CASCADE,
        related_name="registrations"
    )

    slot = models.ForeignKey(
        WorkshopSlot,
        on_delete=models.PROTECT,
        related_name="registrations"
    )

    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)

    number_of_participants = models.PositiveIntegerField()
    special_requests = models.TextField(blank=True, null=True)
    gst_number = models.CharField(max_length=50, blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    # 🔗 LINK TO ORDERS APP
    payment_order = models.OneToOneField(
        "orders.PaymentOrder",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="workshop_registration"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.workshop.name}"