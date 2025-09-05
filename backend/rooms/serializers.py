from rest_framework import serializers
from .models import Property, PropertyImage, PropertyReview, LandlordReview, Favorite, PropertyView
from accounts.models import UserProfile
from django.contrib.auth.models import User

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ('id', 'image', 'caption', 'is_primary', 'uploaded_at')

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    landlord_name = serializers.CharField(source='landlord.username', read_only=True)
    landlord_email = serializers.CharField(source='landlord.email', read_only=True)
    is_favorited = serializers.SerializerMethodField()
    
    class Meta:
        model = Property
        fields = '__all__'
    
    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Favorite.objects.filter(tenant=request.user, property=obj).exists()
        return False

class PropertyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = (
            'title', 'property_type', 'location', 'address', 'price',
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
    
    class Meta:
        model = Property
        fields = (
            'id', 'title', 'property_type', 'location', 'price',
            'bedrooms', 'bathrooms', 'area_sqft', 'status',
            'landlord_name', 'is_favorited', 'primary_image', 'created_at'
        )
    
    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Favorite.objects.filter(tenant=request.user, property=obj).exists()
        return False

    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return self.context['request'].build_absolute_uri(primary_image.image.url)
        return None

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
