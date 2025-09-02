from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, get_user_model
from django.shortcuts import get_object_or_404, redirect
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.urls import reverse
from django.utils import timezone
from .serializers import RegisterSerializer, UserProfileSerializer, ProfileDetailSerializer, ProfileUpdateSerializer
from .models import UserProfile, EmailVerificationToken, User
from .email_utils import send_verification_email

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Send verification email
        if settings.EMAIL_VERIFICATION_ENABLED:
            send_verification_email(user)
        
        # Return user profile information
        profile = UserProfile.objects.get(user=user)
        profile_serializer = UserProfileSerializer(profile)
        
        response_data = profile_serializer.data
        response_data['message'] = 'Registration successful. Please check your email to verify your account.'
        
        return Response(response_data, status=status.HTTP_201_CREATED)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {"error": "Both email and password are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        user = authenticate(request, email=email, password=password)
        
        if user is None:
            return Response(
                {"error": "Invalid credentials"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        # Check if email is verified if email verification is enabled
        if settings.EMAIL_VERIFICATION_ENABLED and not user.profile.email_verified:
            return Response(
                {
                    "error": "Email not verified. Please check your email for the verification link.",
                    "resend_verification_url": request.build_absolute_uri(
                        reverse('resend-verification-email')
                    )
                }, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        try:
            from rest_framework_simplejwt.tokens import RefreshToken
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            profile = user.profile
            profile_serializer = UserProfileSerializer(profile)
            
            # Update last login
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
            
            return Response({
                "message": "Login successful",
                "user": profile_serializer.data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            })
            
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@method_decorator(csrf_exempt, name='dispatch')
class ProfileDetailView(generics.RetrieveAPIView):
    """
    Get user profile details (public view)
    """
    serializer_class = ProfileDetailSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_object(self):
        user_id = self.kwargs.get('user_id')
        user = get_object_or_404(User, id=user_id)
        return get_object_or_404(UserProfile, user=user)

@method_decorator(csrf_exempt, name='dispatch')
class MyProfileView(generics.RetrieveUpdateAPIView):
    """
    Get or update current user's profile
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProfileDetailSerializer
        return ProfileUpdateSerializer
    
    def get_object(self):
        return get_object_or_404(UserProfile, user=self.request.user)

@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(csrf_exempt, name='dispatch')
class EmailVerificationView(APIView):
    """
    Verify user's email using the verification token
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, token):
        try:
            token_obj = EmailVerificationToken.objects.get(token=token, is_used=False)
            
            if not token_obj.is_valid():
                return redirect(f"{settings.FRONTEND_URL}/verification/error/?error=expired")
            
            user = token_obj.user
            profile = user.profile
            
            if not profile.email_verified:
                # Mark email as verified
                profile.email_verified = True
                profile.save()
                
                # Activate user account if it's not already active
                if not user.is_active:
                    user.is_active = True
                    user.save()
                
                # Mark token as used
                token_obj.is_used = True
                token_obj.save()
                
                # Redirect to success page on frontend
                return redirect(f"{settings.FRONTEND_URL}/verification/success/")
            
            # Email already verified
            return redirect(f"{settings.FRONTEND_URL}/verification/already-verified/")
            
        except (EmailVerificationToken.DoesNotExist, UserProfile.DoesNotExist):
            return redirect(f"{settings.FRONTEND_URL}/verification/error/?error=invalid")
    
    def post(self, request, token):
        """API endpoint for email verification (for programmatic use)"""
        try:
            token_obj = EmailVerificationToken.objects.get(token=token, is_used=False)
            
            if not token_obj.is_valid():
                return Response(
                    {'error': 'Verification link has expired. Please request a new one.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user = token_obj.user
            profile = user.profile
            
            if not profile.email_verified:
                # Mark email as verified
                profile.email_verified = True
                profile.save()
                
                # Activate user account if it's not already active
                if not user.is_active:
                    user.is_active = True
                    user.save()
                
                # Mark token as used
                token_obj.is_used = True
                token_obj.save()
                
                return Response(
                    {'message': 'Email verified successfully'},
                    status=status.HTTP_200_OK
                )
            
            return Response(
                {'message': 'Email already verified'},
                status=status.HTTP_200_OK
            )
            
        except EmailVerificationToken.DoesNotExist:
            return Response(
                {'error': 'Invalid verification token'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )

@method_decorator(csrf_exempt, name='dispatch')
class ResendVerificationEmailView(APIView):
    """
    Resend verification email to the user
    """
    permission_classes = [permissions.AllowAny]  # Allow unauthenticated access for this endpoint
    
    def post(self, request):
        if not settings.EMAIL_VERIFICATION_ENABLED:
            return Response(
                {'error': 'Email verification is not enabled'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        email = request.data.get('email')
        if not email:
            return Response(
                {'error': 'Email is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
            profile = user.profile
            
            if profile.email_verified:
                return Response(
                    {'message': 'Email is already verified'},
                    status=status.HTTP_200_OK
                )
                
            # Check rate limiting (prevent abuse)
            last_sent = EmailVerificationToken.objects.filter(
                user=user,
                created_at__gt=timezone.now() - timezone.timedelta(minutes=5)
            ).exists()
            
            if last_sent:
                return Response(
                    {'error': 'Verification email was recently sent. Please wait before requesting another.'},
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )
            
            # Send verification email
            send_verification_email(user)
            
            return Response(
                {
                    'message': 'Verification email has been resent. Please check your inbox.',
                    'email': user.email  # For confirmation
                },
                status=status.HTTP_200_OK
            )
            
        except User.DoesNotExist:
            # For security reasons, don't reveal if the email exists or not
            return Response(
                {
                    'message': 'If an account with this email exists, a verification email has been sent.'
                },
                status=status.HTTP_200_OK
            )

@method_decorator(csrf_exempt, name='dispatch')
class LandlordListView(generics.ListAPIView):
    """
    List all landlords with their profiles and stats
    """
    serializer_class = ProfileDetailSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return UserProfile.objects.filter(user_type='landlord').select_related('user')