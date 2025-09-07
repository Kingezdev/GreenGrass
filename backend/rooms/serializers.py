from rest_framework import serializers
from .models import Property, PropertyImage, PropertyReview, LandlordReview, Favorite, PropertyView, Room
from accounts.models import UserProfile
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

class RoomImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ('id', 'image', 'caption', 'is_primary', 'uploaded_at')

class RoomSerializer(serializers.ModelSerializer):
    images = RoomImageSerializer(many=True, read_only=True, source='room_images')
    property_title = serializers.CharField(source='property.title', read_only=True)
    property_location = serializers.CharField(source='property.location', read_only=True)
    
    class Meta:
        model = Room
        fields = (
            'id', 'property', 'property_title', 'property_location',
            'room_type', 'room_number', 'price', 'area_sqft', 'status',
            'description', 'has_bathroom', 'has_kitchen', 'has_balcony',
            'has_ac', 'created_at', 'updated_at', 'images'
        )
        read_only_fields = ('created_at', 'updated_at')

class RoomCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = (
            'room_type', 'room_number', 'price', 'area_sqft', 'status',
            'description', 'has_bathroom', 'has_kitchen', 'has_balcony', 'has_ac'
        )
    
    def validate(self, data):
        property_id = self.context.get('property_id')
        if property_id:
            property = Property.objects.filter(id=property_id).first()
            if property and property.rental_type == 'full_property':
                raise ValidationError("Cannot add rooms to a property that is only for full property rental")
        return data

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ('id', 'image', 'caption', 'is_primary', 'uploaded_at')

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    rooms = RoomSerializer(many=True, read_only=True, source='rooms.all')
    landlord_name = serializers.CharField(source='landlord.username', read_only=True)
    landlord_email = serializers.CharField(source='landlord.email', read_only=True)
    is_favorited = serializers.SerializerMethodField()
    available_rooms_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Property
        fields = (
            'id', 'landlord', 'landlord_name', 'landlord_email', 'title', 'property_type',
            'rental_type', 'location', 'address', 'price', 'bedrooms', 'bathrooms',
            'area_sqft', 'description', 'status', 'furnished', 'parking',
            'pets_allowed', 'utilities_included', 'created_at', 'updated_at',
            'images', 'rooms', 'is_favorited', 'available_rooms_count'
        )
    
    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Favorite.objects.filter(tenant=request.user, property=obj).exists()
        return False

class PropertyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = (
            'title', 'property_type', 'rental_type', 'location', 'address', 'price',
            'bedrooms', 'bathrooms', 'area_sqft', 'description',
            'furnished', 'parking', 'pets_allowed', 'utilities_included'
        )
    
    def create(self, validated_data):
        # The landlord will be set in the view
        return Property.objects.create(**validated_data)

class PropertyUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            'title', 'property_type', 'location', 'address', 'price',
            'bedrooms', 'bathrooms', 'area_sqft', 'description',
            'furnished', 'parking', 'pets_allowed', 'utilities_included',
            'status'
        ]
        extra_kwargs = {field: {'required': False} for field in fields}
    
    def update(self, instance, validated_data):
        # Update only the fields that are provided in the request
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class PropertyListSerializer(serializers.ModelSerializer):
    landlord_name = serializers.CharField(source='landlord.username', read_only=True)
    is_favorited = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()
    available_rooms_count = serializers.SerializerMethodField()
    min_room_price = serializers.SerializerMethodField()
    
    class Meta:
        model = Property
        fields = (
            'id', 'title', 'property_type', 'rental_type', 'location', 'price',
            'bedrooms', 'bathrooms', 'area_sqft', 'status', 'landlord_name',
            'is_favorited', 'primary_image', 'created_at', 'available_rooms_count',
            'min_room_price'
        )
    
    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Favorite.objects.filter(tenant=request.user, property=obj).exists()
        return False

    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary_image.image.url)
            return primary_image.image.url
        return None
        
    def get_available_rooms_count(self, obj):
        if hasattr(obj, 'available_rooms_count'):
            return obj.available_rooms_count
        if obj.rental_type == 'full_property':
            return 1 if obj.status == 'available' else 0
        return obj.rooms.filter(status='available').count()
        
    def get_min_room_price(self, obj):
        if obj.rental_type == 'full_property':
            return obj.price
        min_price = obj.rooms.filter(status='available').order_by('price').values_list('price', flat=True).first()
        return min_price if min_price is not None else None

class PropertyReviewSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.username', read_only=True)
    
    class Meta:
        model = PropertyReview
        fields = ('id', 'rating', 'comment', 'tenant_name', 'created_at', 'updated_at')
        read_only_fields = ('id', 'tenant_name', 'created_at', 'updated_at')

class PropertyReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyReview
        fields = ('rating', 'comment')

class LandlordReviewSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.username', read_only=True)
    landlord_name = serializers.CharField(source='landlord.username', read_only=True)
    
    class Meta:
        model = LandlordReview
        fields = ('id', 'rating', 'comment', 'tenant_name', 'landlord_name', 'created_at', 'updated_at')
        read_only_fields = ('id', 'tenant_name', 'landlord_name', 'created_at', 'updated_at')

class LandlordReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandlordReview
        fields = ('rating', 'comment')

class FavoriteSerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(source='property.title', read_only=True)
    property_location = serializers.CharField(source='property.location', read_only=True)
    property_price = serializers.DecimalField(source='property.price', max_digits=10, decimal_places=2, read_only=True)
    tenant_name = serializers.CharField(source='tenant.username', read_only=True)
    
    class Meta:
        model = Favorite
        fields = ('id', 'property', 'property_title', 'property_location', 'property_price', 'created_at', 'tenant_name')
        read_only_fields = ('tenant', 'created_at')

class PropertyViewSerializer(serializers.ModelSerializer):
    viewer_username = serializers.CharField(source='viewer.username', read_only=True)
    property_title = serializers.CharField(source='property.title', read_only=True)
    
    class Meta:
        model = PropertyView
        fields = ('id', 'property', 'property_title', 'viewer', 'viewer_username', 'ip_address', 'viewed_at')
        read_only_fields = ('viewer', 'ip_address', 'viewed_at')
