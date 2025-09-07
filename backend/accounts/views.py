import logging
from rest_framework import generics, permissions, status, throttling
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, get_user_model
from django.shortcuts import get_object_or_404, redirect, render
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
        
        # The serializer handles user and profile creation
        user = serializer.save()
        
        # Send verification email if enabled
        if settings.EMAIL_VERIFICATION_ENABLED:
            # Pass request to ensure proper URL generation
            send_verification_email(user, request)
        
        # Get the user's profile
        profile = user.profile
        
        # Prepare response data
        response_data = {
            'message': 'Registration successful. Please check your email to verify your account.',
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_active': user.is_active,
                'user_type': profile.user_type,
                'profile_id': profile.id
            }
        }
        
        # Add profile-specific data based on user type
        if profile.user_type == 'landlord':
            response_data['user'].update({
                'property_name': profile.property_name,
                'years_experience': profile.years_experience
            })
        
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

logger = logging.getLogger(__name__)
@method_decorator(csrf_exempt, name='dispatch')
class EmailVerificationView(APIView):
    """
    Verify user's email using the verification token
    """
    permission_classes = [permissions.AllowAny]
    throttle_classes = [throttling.AnonRateThrottle]  # You can replace with custom throttle

    def verify_token(self, token_obj):
        """
        Helper function to perform the actual verification logic
        """
        user = token_obj.user
        profile = user.profile

        if not profile.email_verified:
            profile.email_verified = True
            profile.save()
            logger.info(f"Email verified for user {user.email}")

        if not user.is_active:
            user.is_active = True
            user.save()

        token_obj.is_used = True
        token_obj.save()

        return user

    def get(self, request, token):
        """
        Handle email verification link from email
        Renders success or error template based on verification result
        """
        try:
            token_obj = EmailVerificationToken.objects.get(token=token, is_used=False)

            if not token_obj.is_valid():
                logger.warning(f"Expired token attempt: {token}")
                return render(request, 'verification/error.html', 
                           {'error': 'expired'}, 
                           status=400)

            user = self.verify_token(token_obj)
            return render(request, 'verification/success.html', 
                        {'user': user, 'token': token})

        except (EmailVerificationToken.DoesNotExist, UserProfile.DoesNotExist):
            logger.warning(f"Invalid token attempt: {token}")
            return render(request, 'verification/error.html', 
                        {'error': 'invalid'}, 
                        status=400)

    def post(self, request, token):
        """
        API endpoint for email verification (programmatic)
        """
        try:
            token_obj = EmailVerificationToken.objects.get(token=token, is_used=False)

            if not token_obj.is_valid():
                logger.warning(f"Expired token attempt (POST): {token}")
                return Response(
                    {'error': 'Verification link has expired. Please request a new one.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            self.verify_token(token_obj)
            return Response({'message': 'Email verified successfully'}, status=status.HTTP_200_OK)

        except EmailVerificationToken.DoesNotExist:
            logger.warning(f"Invalid token attempt (POST): {token}")
            return Response({'error': 'Invalid verification token'}, status=status.HTTP_400_BAD_REQUEST)

        except UserProfile.DoesNotExist:
            logger.error(f"User profile not found for token: {token}")
            return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)

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
            
            # Send verification email with request to ensure proper URL generation
            send_verification_email(user, request=request)
            
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
    """List all landlords with their profiles and stats"""
    serializer_class = ProfileDetailSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return UserProfile.objects.filter(user_type='landlord').select_related('user')
