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
            'has_diabetes', 'insulin', 'dietary_preferences', 
            'family_history','health_condition_preferences'
        ]
    def validate_data(self,data):
        print("Received in serializer:", data)
        return data
    
    def validate_gender(self, value):
        """Normalize gender input and validate choices."""
        valid_choices = ['male', 'female']
        value = value.lower()
        if value not in valid_choices:
            raise serializers.ValidationError(f"Invalid gender. Choose from {valid_choices}.")
        return value

    def validate_physical_activity(self, value):
        """Normalize physical activity input and validate choices."""
        valid_choices = ['low', 'medium', 'high']
        value = value.lower()
        if value not in valid_choices:
            raise serializers.ValidationError(f"Invalid physical activity level. Choose from {valid_choices}.")
        return value

    def validate(self, data):
        """Ensure insulin value is provided only if the user has diabetes."""
        if data.get('has_diabetes') and data.get('insulin') is None:
            raise serializers.ValidationError({"insulin": "This field is required for users with diabetes."})
        return data

    def create(self, validated_data):
        """Create user profile linked to the authenticated user."""
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
