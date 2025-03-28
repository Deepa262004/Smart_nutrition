from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class CustomUser(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        related_name="customuser_set",  # Change related_name
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="customuser_permissions_set",  # Change related_name
        blank=True
    )

    def __str__(self):
        return self.username



from django.contrib.auth import get_user_model

User = get_user_model()

class UserProfile(models.Model):

    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female')
    ]

    FAMILY_HISTORY_CHOICES=(
        ('diabetic','Diabetic'),
        ('non_diabetic','Non Diabetic')
    )
    DIET_CHOICE = [
        ('vegetarian', 'Vegetarian'),
        ('non vegetarian', 'Non Vegetarian'),
        ('vegan', 'Vegan'),
    ]

    HEALTH_CHOICES=[
        ('diabetes','Diabetes'),
        ('cardiovascular','Cardiovascular'),
        ('both','Both'),
        ('none','None')
    ]

    PHYSICAL_ACTIVITY_CHOICES = [
    ('sedentary', 'Sedentary (Minimal movement, mostly sitting)'),
    ('low_active', 'Low active (Light physical activity, occasional exercise)'),
    ('active', 'Active (Regular exercise, moderate physical activity)'),
    ('very_active', 'Very active (Intense daily physical activity or workouts)'),
]

    gender = models.CharField(max_length=10, choices=GENDER_CHOICES,default="other")
    physical_activity = models.CharField(max_length=150, choices=PHYSICAL_ACTIVITY_CHOICES,default='low_active')

    name = models.CharField(max_length=100,default="guest")
    goal = models.CharField(max_length=255,default="None")
    age = models.IntegerField(default=25)  # You can change 25 to any appropriate default value
    height = models.FloatField(default=150)
    weight = models.FloatField(default=55)
    health_condition_preferences=models.CharField(
        max_length=20,
        choices=HEALTH_CHOICES,
        null=True,
        blank=True
    )
    insulin = models.FloatField(null=True, blank=True)
    # physical_activity = models.CharField(max_length=20, choices=[('Low', 'low'), ('Moderate', 'moderate'), ('Active', 'Active')], default='Low' )
    dietary_preference = models.CharField(max_length=100, choices=DIET_CHOICE, blank=True, null=True)
    family_history = models.TextField(blank=True,choices=FAMILY_HISTORY_CHOICES, null=True)

    def __str__(self):
        return self.name