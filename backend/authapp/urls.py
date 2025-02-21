from django.urls import path
from .views import signup, get_user_details,predict_diet

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('user/details/', get_user_details, name='user-details'),
    path('predict/', predict_diet, name='predict_diet'),
]
