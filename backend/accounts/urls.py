from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    
    # JWT Token endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profile endpoints
    path('profile/', views.MyProfileView.as_view(), name='my-profile'),
    path('profile/<str:username>/', views.ProfileDetailView.as_view(), name='profile-detail'),
    
    # Public endpoints
    path('landlords/', views.LandlordListView.as_view(), name='landlord-list'),
]