from django.urls import path
from .views import signup, get_user_details,predict_diet,login_view,profile_setup,get_user_profile

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('user/details/', get_user_details, name='user-details'),
    path('login/', login_view, name='login'),
    path('profile/setup/', profile_setup, name="profile-setup"),
    path('get/', get_user_profile, name="profile-get"),
    path('predict/', predict_diet, name='predict_diet'),

]
