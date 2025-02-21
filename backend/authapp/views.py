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
from .serializers import UserSerializer
import joblib
import pandas as pd
import numpy as np


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
    serializer = UserSerializer(data=request.data)
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    user = request.user
    return Response({"id": user.id, "username": user.username, "email": user.email})
