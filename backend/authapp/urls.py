from django.urls import path
from .views import signup, get_user_details,predict_diet,login_view,profile_setup,get_user_profile,ingredient_substitute_view,get_choices,update_profile,ingredient_substitute_views

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('user/details/', get_user_details, name='user-details'),
    path('login/', login_view, name='login'),
    path('profile/setup/', profile_setup, name="profile-setup"),
    path('get/', get_user_profile, name="profile-get"),
    path('predict/', predict_diet, name='predict_diet'),
    path("ingredient-substitutes/", ingredient_substitute_view, name="ingredient_substitutes"),
    path("ingredient/substitutes/", ingredient_substitute_views, name="ingredient_substitutes"),
    path('choices/', get_choices, name='get-choices'),
    path('update/<str:username>/', update_profile, name='update_profile'),
]


