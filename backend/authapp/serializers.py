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


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for storing user health details."""
    
    class Meta:
        model = UserProfile
        fields = [
            'age', 'weight', 'height', 'daily_insulin_level', 
            'physical_activity', 'health_condition_preferences', 
            'dietary_preferences', 'family_history', 'gender'
        ]

    def create(self, validated_data):
        """Create user profile linked to the authenticated user."""
        user = self.context['request'].user
        profile, created = UserProfile.objects.update_or_create(user=user, defaults=validated_data)
        return profile


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
