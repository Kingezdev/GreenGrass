from rest_framework import generics, permissions
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import RegisterSerializer, UserProfileSerializer, ProfileDetailSerializer, ProfileUpdateSerializer
from .models import UserProfile

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Return user profile information
        profile = UserProfile.objects.get(user=user)
        profile_serializer = UserProfileSerializer(profile)
        
        return Response(profile_serializer.data, status=status.HTTP_201_CREATED)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user is None:
            return Response(
                {"error": "Invalid credentials"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        try:
            from rest_framework_simplejwt.tokens import RefreshToken
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            profile = UserProfile.objects.get(user=user)
            profile_serializer = UserProfileSerializer(profile)
            
            return Response({
                "message": "Login successful",
                "user": profile_serializer.data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            })
            
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "User profile not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
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
        username = self.kwargs.get('username')
        user = get_object_or_404(User, username=username)
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
class LandlordListView(generics.ListAPIView):
    """
    List all landlords with their profiles and stats
    """
    serializer_class = ProfileDetailSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return UserProfile.objects.filter(user_type='landlord').select_related('user')