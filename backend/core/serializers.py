from rest_framework import serializers
from django.core.validators import MinValueValidator
from .models import Property

class PropertySerializer(serializers.ModelSerializer):
    """
    Serializer for the Property model.
    Includes validation and additional computed fields.
    """
    landlord_username = serializers.ReadOnlyField(source='landlord.username')
    landlord_email = serializers.ReadOnlyField(source='landlord.email')
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M', read_only=True)
    updated_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M', read_only=True)
    
    class Meta:
        model = Property
        fields = [
            'id', 'title', 'description', 'property_type', 'price',
            'bedrooms', 'bathrooms', 'square_feet', 'address', 'city',
            'state', 'zip_code', 'is_available', 'created_at', 'updated_at',
            'landlord', 'landlord_username', 'landlord_email'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at', 'landlord', 'landlord_username', 'landlord_email')
        extra_kwargs = {
            'price': {'min_value': 0},
            'bedrooms': {'min_value': 0},
            'bathrooms': {'min_value': 0.5},
            'square_feet': {'min_value': 0},
        }

    def validate(self, data):
        """
        Object-level validation for property data.
        """
        # Ensure price is reasonable
        if 'price' in data and data['price'] > 1000000:  # $1,000,000/month max
            raise serializers.ValidationError({"price": "Price is too high. Please contact support for premium listings."})
        
        # Ensure square footage is reasonable for the number of bedrooms
        if 'bedrooms' in data and 'square_feet' in data:
            min_sqft_per_bedroom = 200  # Minimum square feet per bedroom
            if data['bedrooms'] > 0 and data['square_feet'] / data['bedrooms'] < min_sqft_per_bedroom:
                raise serializers.ValidationError({
                    "square_feet": f"Square footage is too low for the number of bedrooms. Minimum {min_sqft_per_bedroom} sqft per bedroom recommended."
                })
        
        # Validate zip code format (US format)
        if 'zip_code' in data:
            import re
            if not re.match(r'^\d{5}(-\d{4})?$', data['zip_code']):
                raise serializers.ValidationError({"zip_code": "Enter a valid zip code (e.g., 12345 or 12345-6789)."})
        
        return data
    
    def create(self, validated_data):
        """
        Create and return a new Property instance, given the validated data.
        """
        # Ensure the user is a landlord
        user = self.context['request'].user
        if not hasattr(user, 'userprofile') or user.profile.user_type != 'landlord':
            raise serializers.ValidationError({"detail": "Only landlords can create properties."})
        
        # Set the landlord to the current user
        validated_data['landlord'] = user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """
        Update and return an existing Property instance, given the validated data.
        """
        # Ensure the user is the owner of the property
        user = self.context['request'].user
        if instance.landlord != user:
            raise serializers.ValidationError({"detail": "You do not have permission to update this property."})
        
        return super().update(instance, validated_data)
