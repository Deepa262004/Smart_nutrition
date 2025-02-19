from django.urls import path
from .views import signup, get_user_details

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('user/details/', get_user_details, name='user-details'),
]
