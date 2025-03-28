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
    DIET_CHOI = [
        ('vegetarian', 'Vegetarian'),
        ('non vegetarian', 'Non Vegetarian'),
        ('vegan', 'Vegan'),
    ]
    PHYSICAL_ACTIVITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High')
    ]

    HEALTH_CHOICES=[
        ('diabetes','Diabetes'),
        ('cardiovascular','Cardiovascular'),
        ('none','none')
    ]

    gender = models.CharField(max_length=10, choices=GENDER_CHOICES,default="other")
    physical_activity = models.CharField(max_length=10, choices=PHYSICAL_ACTIVITY_CHOICES,default='low')

    name = models.CharField(max_length=100,default="guest")
    goal = models.CharField(max_length=255,default="None")
    age = models.IntegerField(default=25)  # You can change 25 to any appropriate default value
    height = models.FloatField(default=150)
    weight = models.FloatField(default=55)
    has_diabetes = models.BooleanField(default=False)
    insulin = models.FloatField(null=True, blank=True)
    health_condition_preferences=models.CharField(
        max_length=20,
        choices=HEALTH_CHOICES,
        null=True,
        blank=True
    )

    # physical_activity = models.CharField(max_length=20, choices=[('Low', 'low'), ('Moderate', 'moderate'), ('Active', 'Active')], default='Low' )
    dietary_preferences = models.CharField(
        max_length=20,
        choices=DIET_CHOI,
        null=True,
        blank=True)
    family_history = models.CharField(
        max_length=20,
        choices=FAMILY_HISTORY_CHOICES,
        null=True,
        blank=True
    )

    def __str__(self):
        return self.name