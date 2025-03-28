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
import random


User = get_user_model()

# Load Models
diabetes_model = joblib.load(r"authapp/data/diabetes_model (1).pkl")
cardio_model = joblib.load(r"authapp/data/cardio_model (1).pkl")

# Load Recipes Data
recipes_df = pd.read_csv(r"authapp/data/final_rexipe(in) (1) (2).csv")
recipes_df['Diet'] = recipes_df['Diet'].str.strip().str.lower()


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import pandas as pd

@api_view(['POST'])
def predict_diet(request):
    """Predict diet recommendations based on user profile."""
    serializer = UserProfileSerializer(data=request.data)
    
    if serializer.is_valid():
        user_profile = serializer.validated_data

        # Handle missing values safely
        glucose = user_profile.get('daily_insulin_level', 0)
        weight = user_profile.get('weight', 0)
        height = user_profile.get('height', 1)  # Avoid division by zero
        bmi = weight / ((height / 100) ** 2)
        age = user_profile.get('age', 0)
        systolic_bp = user_profile.get('systolic_bp', 0)
        diastolic_bp = user_profile.get('diastolic_bp', 0)
        cholesterol = user_profile.get('cholesterol', 0)
        gender = 1 if user_profile.get('gender', '').lower() in ['male', 'female'] else 0
        family_history = user_profile.get('family_history', '').lower()
        health_condition_preferences = user_profile.get('health_condition_preferences', '').lower()
        dietary_preferences = user_profile.get('dietary_preferences', '').lower()

        # Prepare input data for prediction
        input_data = pd.DataFrame([[glucose, bmi, systolic_bp, diastolic_bp, cholesterol, age, gender]],
                                  columns=['Glucose', 'BMI', 'Systolic_BP', 'Diastolic_BP', 'cholesterol', 'Age', 'gender'])

        try:
            predicted_outcome = diabetes_model.predict(input_data)[0]
            predicted_cardio = cardio_model.predict(input_data)[0]
        except Exception as e:
            return Response({"error": f"Model prediction error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Determine health conditions
        is_diabetic = (predicted_outcome == 1) or (family_history == 'diabetic') or (health_condition_preferences in ['diabetes', 'both'])
        has_cardio = (predicted_cardio == 1) or (health_condition_preferences in ['cardiovascular', 'both'])

        # Filter recipes based on dietary preferences
        recommended_recipes = recipes_df
        if dietary_preferences:
            recommended_recipes = recommended_recipes[recommended_recipes['Diet'].str.lower() == dietary_preferences]

        # Strictly filter only pure vegetarian recipes
        # Strictly filter only Vegetarian and High Protein Vegetarian diets
        if dietary_preferences == 'Vegetarian':
            vegetarian_diets = ['vegetarian']
            recommended_recipes = recommended_recipes[recommended_recipes['Diet']=='vegetarian']
        
        if dietary_preferences == 'Non-Vegetarian':
            non_vegetarian_diets = ['non vegetarian']
            recommended_recipes = recommended_recipes[recommended_recipes['Diet']=='non vegetarian']
        
        
        # Adjust recipes for health conditions
        if is_diabetic:
            recommended_recipes = recommended_recipes[~recommended_recipes['RecipeName'].str.contains("sugar", case=False, na=False)]
        if has_cardio:
            recommended_recipes = recommended_recipes[~recommended_recipes['RecipeName'].str.contains("fried", case=False, na=False)]

        # Randomly select up to 5 recipes
        recommended_recipes = recommended_recipes.sample(n=min(5, len(recommended_recipes)), random_state=random.randint(1, 1000)).to_dict('records')

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


from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view


# ✅ Create or Update Profile
@api_view(['POST'])
def setup_profile(request):
    username = request.data.get('username')
    
    if not username:
        return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    profile, created = UserProfile.objects.update_or_create(
        username=username, defaults=request.data
    )
    
    return Response(
        {"message": "Profile created" if created else "Profile updated", "profile": UserProfileSerializer(profile).data},
        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
    )

# ✅ Fetch Profile by Username
# @api_view(['GET'])
# def get_profile(request, username):
#     try:
#         profile = UserProfile.objects.get(username=username)
#         return Response(UserProfileSerializer(profile).data, status=status.HTTP_200_OK)
#     except UserProfile.DoesNotExist:
#         return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Update Profile
@api_view(['PUT'])
def update_profile(request, username):
    try:
        profile = UserProfile.objects.get(name=username)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated", "profile": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except UserProfile.DoesNotExist:
        return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def profile_setup(request):
    """API to handle user profile setup."""
    user = request.user

    try:
        # Check if profile exists or create a new one
        user_profile, created = UserProfile.objects.get_or_create(user=user)

        # Update fields from request data
        user_profile.goal = request.data.get('goal', user_profile.goal)
        user_profile.name = request.data.get('name', user_profile.name)
        user_profile.age = request.data.get('age', user_profile.age)
        user_profile.height = request.data.get('height', user_profile.height)
        user_profile.insulin = request.data.get('insulin', user_profile.insulin)
        user_profile.weight = request.data.get('weight', user_profile.weight)

        user_profile.save()

        return Response({"message": "Profile updated successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_user_profile(request):
    """API to get user profile details."""
    try:
        user_profile = UserProfile.objects.get(na)
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except UserProfile.DoesNotExist:
        return Response({"message": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["GET"])
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access    
def get_choices(request):
    choices = {
        "gender_choices": UserProfile.GENDER_CHOICES,
        "health_choices": UserProfile.HEALTH_CHOICES,
        "physical_activity_choices": UserProfile.PHYSICAL_ACTIVITY_CHOICES,
        "diet_choices": UserProfile.DIET_CHOICE,
        "family_history_choices": UserProfile.FAMILY_HISTORY_CHOICES,
    }
    return JsonResponse(choices)

API_KEY= '80f8317fe9164e8a9951298d3009ff2e'
from django.views.decorators.csrf import csrf_exempt
import requests
from django.http import JsonResponse

def get_ingredient_substitutes(ingredient_name):
    url = f"https://api.spoonacular.com/food/ingredients/substitutes?ingredientName={ingredient_name}&apiKey={API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    return {"error": "Failed to fetch substitutes"}


@csrf_exempt
def ingredient_substitute_view(request):
    if request.method == "GET":
        ingredient_name = request.GET.get("ingredient", "")
        if not ingredient_name:
            return JsonResponse({"error": "Ingredient name is required"}, status=400)
        
        substitutes = get_ingredient_substitutes(ingredient_name)
        return JsonResponse(substitutes)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)



