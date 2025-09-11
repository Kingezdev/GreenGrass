from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from rooms.models import Property
from .serializers import PropertySerializer


class IsLandlordOrReadOnly(BasePermission):
    """
    Custom permission to only allow landlords to create, update, or delete properties.
    """
    def has_permission(self, request, view):
        # Allow read-only for all requests
        if request.method in permissions.SAFE_METHODS:
            return True

        # For write operations, user must be authenticated and have a landlord profile
        if not request.user.is_authenticated:
            return False

        # Correct check → use 'profile' (your related_name)
        return hasattr(request.user, 'profile') and request.user.profile.user_type == 'landlord'

    def has_object_permission(self, request, view, obj):
        # Allow read-only for all requests
        if request.method in permissions.SAFE_METHODS:
            return True

        # For write operations, user must be the landlord who owns the property
        return obj.landlord == request.user



class PropertyViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows properties to be viewed or edited.
    """
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated, IsLandlordOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'property_type': ['exact'],
        'bedrooms': ['exact', 'gte', 'lte'],
        'bathrooms': ['exact', 'gte', 'lte'],
        'price': ['exact', 'gte', 'lte'],
        'is_available': ['exact'],
        'city': ['exact', 'icontains'],
        'state': ['exact'],
    }
    search_fields = ['title', 'description', 'address', 'city', 'state', 'zip_code']
    ordering_fields = ['price', 'bedrooms', 'bathrooms', 'square_feet', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """
        This view returns a list of all properties for landlords (their own properties)
        and only available properties for tenants.
        """
        user = self.request.user
        queryset = Property.objects.all()
        
        # Landlords see their own properties, tenants see only available ones
        if hasattr(user, 'userprofile') and user.profile.user_type == 'landlord':
            queryset = queryset.filter(landlord=user)
        else:
            queryset = queryset.filter(is_available=True)
        
        # Additional filtering
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(address__icontains=search_query) |
                Q(city__icontains=search_query) |
                Q(state__icontains=search_query) |
                Q(zip_code__icontains=search_query)
            )
            
        return queryset.select_related('landlord')

    def perform_create(self, serializer):
        """Set the landlord to the current user when creating a property."""
        if not hasattr(self.request.user, 'userprofile') or self.request.user.profile.user_type != 'landlord':
            raise PermissionDenied("Only landlords can create properties.")
        serializer.save(landlord=self.request.user)

    @action(detail=True, methods=['post'])
    def toggle_availability(self, request, pk=None):
        """
        Toggle the availability status of a property.
        Only the property owner can perform this action.
        """
        property = self.get_object()
        if property.landlord != request.user:
            return Response(
                {"detail": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        property.is_available = not property.is_available
        property.save()
        return Response({"is_available": property.is_available})

    def get_serializer_context(self):
        """
        Extra context provided to the serializer class.
        """
        return {
            'request': self.request,
            'format': self.format_kwarg,
            'view': self
        }
