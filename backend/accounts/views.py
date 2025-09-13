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
from django.db import models
from django.db.models import Q
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
from django.contrib.postgres.search import TrigramSimilarity
from rest_framework.throttling import ScopedRateThrottle
from typing import Optional, List, Dict, Any

from .serializers import RegisterSerializer, UserProfileSerializer, ProfileDetailSerializer, ProfileUpdateSerializer, UserSearchSerializer
from .models import UserProfile, EmailVerificationToken, User
from .email_utils import send_verification_email, send_local_verification_email


@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        logger.info(f"Starting registration for email: {request.data.get('email')}")
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # The serializer handles user and profile creation
            logger.info("Creating user and profile...")
            user = serializer.save()
            
            # Send verification email if enabled
            if settings.EMAIL_VERIFICATION_ENABLED:
                logger.info(f"Sending verification email to {user.email}")
                # Use local verification in development, production otherwise
                if settings.DEBUG:
                    send_local_verification_email(user, request)
                else:
                    send_verification_email(user, request)
                logger.info("Verification email sent successfully")
            else:
                logger.info("Email verification is disabled")
                
        except Exception as e:
            logger.error(f"Error during registration: {str(e)}", exc_info=True)
            raise
        
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
        from django.conf import settings
        
        try:
            token_obj = EmailVerificationToken.objects.get(token=token, is_used=False)
            
            if not token_obj.is_valid():
                logger.warning(f"Expired token attempt (GET): {token}")
                return render(
                    request, 
                    'emails/verification_error.html',
                    {'error': 'This verification link has expired. Please request a new one.'},
                    status=400
                )

            # Verify the token
            user = self.verify_token(token_obj)
            
            # Render success template
            return render(
                request,
                'emails/verification_success.html',
                {'email': user.email, 'site_name': getattr(settings, 'SITE_NAME', 'Our Site')}
            )

        except EmailVerificationToken.DoesNotExist:
            logger.warning(f"Invalid token attempt (GET): {token}")
            return render(
                request,
                'emails/verification_error.html',
                {'error': 'Invalid verification link. Please check the link or request a new one.'},
                status=400
            )

    def post(self, request, token):
        """
        API endpoint for email verification (programmatic)
        """
        try:
            token_obj = EmailVerificationToken.objects.get(token=token, is_used=False)

            if not token_obj.is_valid():
                logger.warning(f"Expired token attempt (POST): {token}")
                return Response(
                    {'status': 'error', 'message': 'Verification link has expired. Please request a new one.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            self.verify_token(token_obj)
            return Response(
                {'status': 'success', 'message': 'Email verified successfully'}, 
                status=status.HTTP_200_OK
            )

        except EmailVerificationToken.DoesNotExist:
            logger.warning(f"Invalid token attempt (POST): {token}")
            return Response(
                {'status': 'error', 'message': 'Invalid verification token'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        except UserProfile.DoesNotExist:
            logger.error(f"User profile not found for token: {token}")
            return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)

@method_decorator(csrf_exempt, name='dispatch')
class ResendVerificationEmailView(APIView):
    """
    Resend verification email to the user
    """
    permission_classes = [permissions.AllowAny]  # Allow unauthenticated access for this endpoint
    throttle_classes = [throttling.AnonRateThrottle]  # Add rate limiting
    
    def post(self, request):
        from django.conf import settings
        
        if not settings.EMAIL_VERIFICATION_ENABLED:
            return Response(
                {'status': 'error', 'message': 'Email verification is not enabled'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        email = request.data.get('email')
        if not email:
            return Response(
                {'status': 'error', 'message': 'Email is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
            profile = user.profile
            
            if profile.email_verified:
                return Response(
                    {'status': 'success', 'message': 'Email is already verified'},
                    status=status.HTTP_200_OK
                )
                
            # Check rate limiting (prevent abuse)
            last_sent = EmailVerificationToken.objects.filter(
                user=user,
                created_at__gt=timezone.now() - timezone.timedelta(minutes=5)
            ).exists()
            
            if last_sent:
                return Response(
                    {'status': 'error', 'message': 'Verification email was recently sent. Please wait before requesting another.'},
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )
            
            # Invalidate any existing tokens
            EmailVerificationToken.objects.filter(user=user, is_used=False).update(is_used=True)
            
            # Use local verification in development, production otherwise
            if settings.DEBUG:
                send_local_verification_email(user)
            else:
                send_verification_email(user)
            
            logger.info(f"Resent verification email to {email}")
            
            return Response(
                {
                    'status': 'success',
                    'message': 'Verification email has been resent. Please check your inbox.',
                    'email': user.email  # For confirmation
                },
                status=status.HTTP_200_OK
            )
            
        except User.DoesNotExist:
            # For security reasons, don't reveal if the email exists or not
            logger.warning(f"Resend verification attempt for non-existent email: {email}")
            return Response(
                {
                    'status': 'success',
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
        return UserProfile.objects.filter(
            user_type='landlord',
            user__is_active=True
        ).select_related('user')


class UserSearchView(generics.ListAPIView):
    """
    Enhanced user search with advanced filtering and sorting options.
    
    Search users by first name, last name, or email with the following features:
    - Partial and fuzzy matching using trigram similarity
    - Filter by user type (landlord/tenant)
    - Sort by relevance, name, or email
    - Pagination support
    
    Query Parameters:
        q: Search terms (required)
        user_type: Filter by 'landlord' or 'tenant' (optional)
        exact_match: 'true' for exact matches only (default: false)
        sort: Field to sort by (relevance, name, email, -name, -email)
        min_score: Minimum similarity score (0.0-1.0, default: 0.1)
    """
    serializer_class = UserSearchSerializer
    permission_classes = [permissions.AllowAny]  # Allow unauthenticated access
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'search'
    
    def get_queryset(self) -> models.QuerySet:
        search_query = self.request.query_params.get('q', '').strip()
        user_type = self.request.query_params.get('user_type')
        exact_match = self.request.query_params.get('exact_match', 'false').lower() == 'true'
        min_score = float(self.request.query_params.get('min_score', 0.1))
        
        queryset = User.objects.all()
        
        # Filter by user type if specified
        if user_type and user_type.lower() in ['landlord', 'tenant']:
            queryset = queryset.filter(profile__user_type=user_type.lower())
        
        # If no search query, return empty queryset
        if not search_query:
            return queryset.none()
            
        search_terms = [term.strip() for term in search_query.split() if term.strip()]
        if not search_terms:
            return queryset.none()
            
        # Build the query
        if exact_match:
            # Exact match search
            query = Q()
            for term in search_terms:
                query &= (
                    Q(first_name__iexact=term) |
                    Q(last_name__iexact=term) |
                    Q(email__iexact=term)
                )
            queryset = queryset.filter(query)
        else:
            # Fuzzy search with trigram similarity
            queryset = queryset.annotate(
                first_name_similarity=TrigramSimilarity('first_name', search_query),
                last_name_similarity=TrigramSimilarity('last_name', search_query),
                email_similarity=TrigramSimilarity('email', search_query)
            ).annotate(
                similarity=models.functions.Greatest(
                    'first_name_similarity',
                    'last_name_similarity',
                    'email_similarity'
                )
            ).filter(similarity__gte=min_score)
            
            # Apply ordering
            sort = self.request.query_params.get('sort', '').lower()
            if sort in ['name', 'first_name']:
                queryset = queryset.order_by('first_name', 'last_name')
            elif sort == '-name' or sort == '-first_name':
                queryset = queryset.order_by('-first_name', '-last_name')
            elif sort == 'email':
                queryset = queryset.order_by('email')
            elif sort == '-email':
                queryset = queryset.order_by('-email')
            elif not exact_match:
                # Default: order by similarity score
                queryset = queryset.order_by('-similarity')
        
        return queryset.select_related('profile').distinct()
        
    def list(self, request, *args, **kwargs) -> Response:
        """
        Handle GET request and return paginated results.
        """
        queryset = self.filter_queryset(self.get_queryset())
        
        # Return empty list if no search query provided
        if not request.query_params.get('q'):
            return Response({
                'count': 0,
                'next': None,
                'previous': None,
                'results': []
            })
            
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'count': len(serializer.data),
            'next': None,
            'previous': None,
            'results': serializer.data
        })


class TenantListView(generics.ListAPIView):
    """List all tenants with their profiles"""
    serializer_class = ProfileDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(
            user_type='tenant',
            user__is_active=True
        ).select_related('user')
