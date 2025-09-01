from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Property, PropertyImage, PropertyReview, LandlordReview, Favorite, PropertyView
from .serializers import (
    PropertySerializer, PropertyCreateSerializer, 
    PropertyListSerializer, PropertyImageSerializer,
    PropertyReviewSerializer, PropertyReviewCreateSerializer,
    LandlordReviewSerializer, LandlordReviewCreateSerializer,
    FavoriteSerializer
)
from accounts.models import UserProfile
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

class IsLandlordPermission(permissions.BasePermission):
    """
    Custom permission to only allow landlords to create properties.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        try:
            profile = UserProfile.objects.get(user=request.user)
            return profile.user_type == 'landlord'
        except UserProfile.DoesNotExist:
            return False

class IsLandlordOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow read access to everyone but write access only to landlords.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        if not request.user.is_authenticated:
            return False
        
        try:
            profile = UserProfile.objects.get(user=request.user)
            return profile.user_type == 'landlord'
        except UserProfile.DoesNotExist:
            return False

class IsTenantPermission(permissions.BasePermission):
    """
    Custom permission to only allow tenants to create reviews.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        try:
            profile = UserProfile.objects.get(user=request.user)
            return profile.user_type == 'tenant'
        except UserProfile.DoesNotExist:
            return False

@method_decorator(csrf_exempt, name='dispatch')
class PropertyListCreateView(generics.ListCreateAPIView):
    queryset = Property.objects.all()
    permission_classes = [IsLandlordOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['property_type', 'bedrooms', 'bathrooms', 'furnished', 'parking', 'pets_allowed', 'status']
    search_fields = ['title', 'location', 'address', 'description']
    ordering_fields = ['price', 'created_at', 'bedrooms', 'area_sqft']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PropertyCreateSerializer
        return PropertyListSerializer
    
    def get_queryset(self):
        queryset = Property.objects.all()
        
        # Custom price filtering
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
            
        # Location-based search (case-insensitive)
        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(
                Q(location__icontains=location) | Q(address__icontains=location)
            )
            
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(landlord=self.request.user)

@method_decorator(csrf_exempt, name='dispatch')
class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]  # Anyone can view property details
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsLandlordPermission()]
        return [permissions.AllowAny()]
    
    def get_object(self):
        obj = super().get_object()
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            # Only the landlord who owns the property can modify/delete it
            if obj.landlord != self.request.user:
                self.permission_denied(self.request, message="You can only modify your own properties.")
        return obj
    
    def retrieve(self, request, *args, **kwargs):
        property_obj = self.get_object()
        
        # Track property view
        ip_address = self.get_client_ip(request)
        PropertyView.objects.create(
            property=property_obj,
            viewer=request.user if request.user.is_authenticated else None,
            ip_address=ip_address
        )
        
        # Update landlord's total views count
        landlord_profile = UserProfile.objects.get(user=property_obj.landlord)
        landlord_profile.total_property_views += 1
        landlord_profile.save()
        
        return super().retrieve(request, *args, **kwargs)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

@method_decorator(csrf_exempt, name='dispatch')
class LandlordPropertiesView(generics.ListAPIView):
    serializer_class = PropertyListSerializer
    permission_classes = [IsLandlordPermission]
    
    def get_queryset(self):
        return Property.objects.filter(landlord=self.request.user)

@method_decorator(csrf_exempt, name='dispatch')
class PropertyImageUploadView(APIView):
    permission_classes = [IsLandlordPermission]
    
    def post(self, request, property_id):
        property_obj = get_object_or_404(Property, id=property_id, landlord=request.user)
        
        images = request.FILES.getlist('images')
        if not images:
            return Response({"error": "No images provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        uploaded_images = []
        for image in images:
            property_image = PropertyImage.objects.create(
                property=property_obj,
                image=image,
                caption=request.data.get('caption', ''),
                is_primary=len(uploaded_images) == 0 and not property_obj.images.filter(is_primary=True).exists()
            )
            uploaded_images.append(property_image)
        
        serializer = PropertyImageSerializer(uploaded_images, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@method_decorator(csrf_exempt, name='dispatch')
class PropertyReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = PropertyReviewSerializer
    permission_classes = [permissions.AllowAny]  # Anyone can view reviews
    
    def get_queryset(self):
        property_id = self.kwargs['property_id']
        return PropertyReview.objects.filter(property_id=property_id)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PropertyReviewCreateSerializer
        return PropertyReviewSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsTenantPermission()]
        return [permissions.AllowAny()]
    
    def perform_create(self, serializer):
        property_id = self.kwargs['property_id']
        property_obj = get_object_or_404(Property, id=property_id)
        serializer.save(tenant=self.request.user, property=property_obj)

@method_decorator(csrf_exempt, name='dispatch')
class LandlordReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = LandlordReviewSerializer
    permission_classes = [permissions.AllowAny]  # Anyone can view reviews
    
    def get_queryset(self):
        landlord_id = self.kwargs['landlord_id']
        return LandlordReview.objects.filter(landlord_id=landlord_id)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return LandlordReviewCreateSerializer
        return LandlordReviewSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsTenantPermission()]
        return [permissions.AllowAny()]
    
    def perform_create(self, serializer):
        landlord_id = self.kwargs['landlord_id']
        landlord = get_object_or_404(User, id=landlord_id)
        # Verify the user is actually a landlord
        try:
            landlord_profile = UserProfile.objects.get(user=landlord)
            if landlord_profile.user_type != 'landlord':
                return Response({"error": "User is not a landlord"}, status=status.HTTP_400_BAD_REQUEST)
        except UserProfile.DoesNotExist:
            return Response({"error": "Landlord not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer.save(tenant=self.request.user, landlord=landlord)

@method_decorator(csrf_exempt, name='dispatch')
class FavoriteListCreateView(generics.ListCreateAPIView):
    """
    List tenant's favorites or add a property to favorites
    """
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantPermission]
    
    def get_queryset(self):
        return Favorite.objects.filter(tenant=self.request.user)
    
    def perform_create(self, serializer):
        property_id = self.request.data.get('property')
        try:
            property_obj = Property.objects.get(id=property_id)
            # Check if already favorited
            if Favorite.objects.filter(tenant=self.request.user, property=property_obj).exists():
                return Response({"error": "Property already in favorites"}, status=status.HTTP_400_BAD_REQUEST)
            serializer.save(tenant=self.request.user)
        except Property.DoesNotExist:
            return Response({"error": "Property not found"}, status=status.HTTP_404_NOT_FOUND)

@method_decorator(csrf_exempt, name='dispatch')
class FavoriteDeleteView(generics.DestroyAPIView):
    """
    Remove a property from favorites
    """
    permission_classes = [permissions.IsAuthenticated, IsTenantPermission]
    
    def get_queryset(self):
        return Favorite.objects.filter(tenant=self.request.user)
    
    def get_object(self):
        property_id = self.kwargs.get('property_id')
        return get_object_or_404(Favorite, tenant=self.request.user, property_id=property_id)
