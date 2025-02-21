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


class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="profile")
    age = models.PositiveIntegerField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    height = models.FloatField(null=True, blank=True)
    daily_insulin_level = models.FloatField(null=True, blank=True)
    physical_activity = models.CharField(max_length=20, choices=[('low', 'Low'), ('moderate', 'Moderate'), ('high', 'High')], default='low')
    health_condition_preferences = models.CharField(max_length=50, choices=[('diabetes', 'Diabetes'), ('cardiovascular', 'Cardiovascular'), ('both', 'Both')], default='diabetes')
    dietary_preferences = models.CharField(max_length=50, choices=[('vegetarian', 'Vegetarian'), ('non-vegetarian', 'Non-Vegetarian'), ('vegan', 'Vegan')], default='vegetarian')
    family_history = models.CharField(max_length=20, choices=[('diabetic', 'Diabetic'), ('non-diabetic', 'Non-Diabetic')], default='non-diabetic')
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], default='male')

    def __str__(self):
        return f"{self.user.username}'s Profile"
