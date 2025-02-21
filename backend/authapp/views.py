from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import UserSerializer,UserProfileSerializer,FullUserSerializer
import joblib
import pandas as pd
import numpy as np
from rest_framework import status
from .models import UserProfile


User = get_user_model()

# Load Models
diabetes_model = joblib.load(r"authapp/data/diabetes_model (1).pkl")
cardio_model = joblib.load(r"authapp/data/cardio_model (1).pkl")

# Load Recipes Data
recipes_df = pd.read_csv(r"authapp/data/final_rexipe(in) (1).csv")
recipes_df['Diet'] = recipes_df['Diet'].str.strip().str.lower()


@api_view(['POST'])
def predict_diet(request):
    """Predict diet recommendations based on user profile."""
    serializer = UserProfileSerializer(data=request.data)
    if serializer.is_valid():
        user_profile = serializer.validated_data
        glucose = user_profile['daily_insulin_level'] or 0
        bmi = user_profile['weight'] / ((user_profile['height'] / 100) ** 2)
        age = user_profile['age']
        systolic_bp = user_profile.get('systolic_bp', 0)
        diastolic_bp = user_profile.get('diastolic_bp', 0)
        cholesterol = user_profile.get('cholesterol', 0)
        gender = 1 if user_profile['gender'].lower() == 'male' else 0

        # Prepare input data
        input_data = pd.DataFrame([[glucose, bmi, systolic_bp, diastolic_bp, cholesterol, age, gender]],
                                  columns=['Glucose', 'BMI', 'Systolic_BP', 'Diastolic_BP', 'cholesterol', 'Age', 'gender'])
        
        # Model predictions
        predicted_outcome = diabetes_model.predict(input_data)[0]
        predicted_cardio = cardio_model.predict(input_data)[0]

        # Determine conditions
        is_diabetic = predicted_outcome == 1 or user_profile['family_history'].lower() == 'diabetic' or user_profile['health_condition_preferences'].lower() in ['diabetes', 'both']
        has_cardio = predicted_cardio == 1 or user_profile['health_condition_preferences'].lower() in ['cardiovascular', 'both']

        # Filter and recommend recipes
        dietary_preferences = user_profile['dietary_preferences'].lower()
        recommended_recipes = recipes_df[recipes_df['Diet'] == dietary_preferences]
        recommended_recipes = recommended_recipes[['RecipeName', 'TotalTimeInMins', 'Diet']].head(12).to_dict('records')

        return Response({
            'recipes': recommended_recipes, 
            'is_diabetic': is_diabetic, 
            'has_cardio': has_cardio
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def complete_profile(request):
    """Complete user profile after signup."""
    try:
        user_profile, created = UserSerializer.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(user_profile, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated successfully!"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    user = request.user
    return Response({"id": user.id, "username": user.username, "email": user.email})


from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

# Get the CustomUser model
User = get_user_model()

@api_view(["POST"])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)  # Use CustomUser instead of default User model
    except User.DoesNotExist:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=user.username, password=password)  # Authenticate with username
    if user is None:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    # Generate JWT token
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    return Response({
        "message": "Login successful",
        "token": access_token,
        "username": user.username  # Send username for frontend display
    }, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])  # Only logged-in users can update profiles
def profile_setup(request):
    """API to handle user profile setup."""
    serializer = UserProfileSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Profile setup successful", "profile": serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access
def get_user_profile(request):
    """API to get user profile details."""
    try:
        user_profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except UserProfile.DoesNotExist:
        return Response({"message": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)