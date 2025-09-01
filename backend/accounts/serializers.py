from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ('username', 'email', 'first_name', 'last_name', 'user_type', 'phone_number', 'created_at')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    user_type = serializers.ChoiceField(choices=UserProfile.USER_TYPES, write_only=True)
    phone_number = serializers.CharField(max_length=15, required=False, allow_blank=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'user_type', 'phone_number', 'first_name', 'last_name')

    def create(self, validated_data):
        user_type = validated_data.pop('user_type')
        phone_number = validated_data.pop('phone_number', '')
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name
        )
        
        UserProfile.objects.create(
            user=user,
            user_type=user_type,
            phone_number=phone_number
        )
        
        return user

class ProfileDetailSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    average_rating = serializers.SerializerMethodField()
    total_properties = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = ('username', 'email', 'first_name', 'last_name', 'user_type', 'phone_number', 
                 'bio', 'avatar', 'location', 'company_name', 'years_experience', 
                 'total_property_views', 'total_inquiries_received', 'website',
                 'average_rating', 'total_properties', 'created_at', 'updated_at')
        read_only_fields = ('username', 'email', 'user_type', 'total_property_views', 
                           'total_inquiries_received', 'created_at', 'updated_at')
    
    def get_average_rating(self, obj):
        return obj.get_average_rating()
    
    def get_total_properties(self, obj):
        return obj.get_total_properties()

class ProfileUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    
    class Meta:
        model = UserProfile
        fields = ('first_name', 'last_name', 'phone_number', 'bio', 'avatar', 'location', 
                 'company_name', 'years_experience', 'website')
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        
        # Update user fields
        if 'first_name' in user_data:
            instance.user.first_name = user_data['first_name']
        if 'last_name' in user_data:
            instance.user.last_name = user_data['last_name']
        instance.user.save()
        
        # Update profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance