from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import CustomUser, UserProfile


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user registration (email & password only)."""
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        """Hash the password before saving the user."""
        validated_data['password'] = make_password(validated_data['password'])
        user = CustomUser.objects.create(**validated_data)
        return user


from rest_framework import serializers
from .models import UserProfile

from rest_framework import serializers
from .models import UserProfile

from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for storing user health details."""

    class Meta:
        model = UserProfile
        fields = [
            'name', 'goal', 'age', 'height', 'weight', 'gender',
            'health_condition_preferences', 'insulin', 'physical_activity',
            'family_history'
        ]

    def validate_gender(self, value):
        """Normalize gender input and validate choices."""
        valid_choices = ['male', 'female', 'other']
        value = value.lower()
        if value not in valid_choices:
            raise serializers.ValidationError(f"Invalid gender. Choose from {valid_choices}.")
        return value
    
     
    def validate_family_history(self, value):
        """Ensure family history is a valid choice."""
        valid_choices = ['diabetic', 'non_diabetic']
        if value not in valid_choices:
            raise serializers.ValidationError(f"{value} is not a valid choice. Choose from {valid_choices}.")
        return value

    def validate_health_condition(self, value):
        """Normalize health condition input and validate choices."""
        valid_choices = ['none', 'diabetes', 'cardiovascular', 'both']
        value = value.lower()
        if value not in valid_choices:
            raise serializers.ValidationError(f"Invalid health condition. Choose from {valid_choices}.")
        return value

    def validate_physical_activity(self, value):
        """Normalize physical activity input and validate choices."""
        valid_choices = ['sedentary', 'light', 'moderate', 'active']
        value = value.lower()
        if value not in valid_choices:
            raise serializers.ValidationError(f"Invalid physical activity level. Choose from {valid_choices}.")
        return value

    def validate(self, data):
        """Ensure insulin value is required only if the user has diabetes or both conditions."""
        health_condition = data.get('health_condition_preferences')
        if health_condition in ['diabetes', 'both'] and not data.get('insulin'):
            raise serializers.ValidationError({"insulin": "This field is required for users with diabetes or both conditions."})
        return data

    def create(self, validated_data):
        """Create or update user profile linked to the authenticated user."""
        user = self.context['request'].user
        profile, created = UserProfile.objects.update_or_create(user=user, defaults=validated_data)
        return profile

    def update(self, instance, validated_data):
        """Update user profile details."""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance



class FullUserSerializer(serializers.ModelSerializer):
    """Serializer that combines User and UserProfile data."""
    
    profile = UserProfileSerializer()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'profile']

    def update(self, instance, validated_data):
        """Update user and profile details."""
        profile_data = validated_data.pop('profile', {})
        
        # Update User fields
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        # Update or create UserProfile fields
        UserProfile.objects.update_or_create(user=instance, defaults=profile_data)
        
        return instance
