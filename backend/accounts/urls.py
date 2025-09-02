from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.views.decorators.csrf import csrf_exempt
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
    
    # Email Verification
    path('verify-email/<uuid:token>/', csrf_exempt(views.EmailVerificationView.as_view()), name='verify-email'),
    path('resend-verification-email/', csrf_exempt(views.ResendVerificationEmailView.as_view()), name='resend-verification-email'),
    
    # Public endpoints
    path('landlords/', views.LandlordListView.as_view(), name='landlord-list'),
]