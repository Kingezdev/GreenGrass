from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from .models import UserProfile

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True, 
        required=True,
        style={'input_type': 'password'}
    )
    user_type = serializers.ChoiceField(
        write_only=True,
        choices=['landlord', 'tenant'],
        required=True,
        error_messages={
            'required': 'User type is required. Please specify either "landlord" or "tenant".',
            'invalid_choice': 'Invalid user type. Must be either "landlord" or "tenant".'
        }
    )
    landlord = serializers.JSONField(required=False, write_only=True)
    tenant = serializers.JSONField(required=False, write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'password2', 'first_name', 'last_name', 'user_type', 'landlord', 'tenant')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        user_type = attrs.get('user_type')
        if user_type == 'landlord' and 'landlord' not in attrs:
            raise serializers.ValidationError({"landlord": "Landlord details are required."})
        elif user_type == 'tenant' and 'tenant' not in attrs:
            raise serializers.ValidationError({"tenant": "Tenant details are required."})
        
        return attrs

    def create(self, validated_data):
        user_type = validated_data.pop('user_type')
        landlord_data = validated_data.pop('landlord', None)
        tenant_data = validated_data.pop('tenant', None)
        
        # Create the user
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_active=False
        )
        
        # Set password and save user
        user.set_password(validated_data['password'])
        user.save()
        
        # Create user profile with the appropriate type
        profile_data = landlord_data if user_type == 'landlord' else tenant_data
        profile_data['user_type'] = user_type
        
        # Create the user profile
        profile = UserProfile.objects.create(user=user, **profile_data)
        
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    date_of_birth = serializers.DateField(required=False)  # now on profile

    class Meta:
        model = UserProfile
        fields = ('email', 'first_name', 'last_name', 'phone_number', 'avatar', 'bio', 'date_of_birth')
        read_only_fields = ('email',)

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        # Update user fields
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        # Update profile fields
        return super().update(instance, validated_data)


class ProfileDetailSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    is_verified = serializers.BooleanField(source='email_verified', read_only=True)
    date_joined = serializers.DateTimeField(source='user.date_joined', read_only=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    user_type = serializers.CharField(read_only=True)
    property_name = serializers.CharField(required=False, allow_blank=True)
    years_experience = serializers.IntegerField(required=False, min_value=0, allow_null=True)
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = (
            'email', 'first_name', 'last_name', 'phone_number', 
            'avatar', 'avatar_url', 'bio', 'date_of_birth', 'is_verified', 
            'date_joined', 'user_type', 'property_name', 'years_experience',
            'website', 'location'
        )
        read_only_fields = ('is_verified', 'user_type')
        
    def get_avatar_url(self, obj):
        if obj.avatar:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None


class UserSearchSerializer(serializers.ModelSerializer):
    """
    Serializer for public user search results.
    
    Only includes publicly available user information and similarity score.
    """
    user_type = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    score = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'full_name', 'user_type', 'score')
        read_only_fields = fields
    
    def get_user_type(self, obj) -> str:
        """Get the user type from the profile if available."""
        # Only return basic user type (landlord/tenant) without sensitive info
        if hasattr(obj, 'profile'):
            return obj.profile.user_type if hasattr(obj.profile, 'user_type') else None
        return None
    
    def get_full_name(self, obj) -> str:
        """Combine first and last name into a full name string."""
        return f"{obj.first_name} {obj.last_name}".strip()
        
    def get_score(self, obj) -> float:
        """Get the similarity score if available from the search."""
        if hasattr(obj, 'similarity'):
            return round(float(obj.similarity), 4)
        return None


class ProfileUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    current_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    new_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    confirm_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    avatar = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = UserProfile
        fields = (
            'first_name', 'last_name', 'phone_number', 'bio',
            'date_of_birth', 'avatar', 'website', 'location',
            'current_password', 'new_password', 'confirm_password',
            'property_name', 'years_experience'
        )
        extra_kwargs = {
            'avatar': {'required': False, 'allow_null': True},
            'bio': {'required': False, 'allow_blank': True},
            'website': {'required': False, 'allow_blank': True},
            'location': {'required': False, 'allow_blank': True},
            'property_name': {'required': False, 'allow_blank': True},
            'years_experience': {'required': False, 'allow_null': True},
        }  # profile field

    class Meta:
        model = UserProfile
        fields = ('first_name', 'last_name', 'phone_number', 'avatar', 
                  'bio', 'date_of_birth', 'current_password', 'new_password', 'confirm_password')
        extra_kwargs = {
            'phone_number': {'required': False},
            'avatar': {'required': False},
            'bio': {'required': False},
        }

    def validate(self, data):
        # Validate password change if any password field is provided
        if any(field in data for field in ['current_password', 'new_password', 'confirm_password']):
            if not all(field in data for field in ['current_password', 'new_password', 'confirm_password']):
                raise serializers.ValidationError({
                    'password': 'Current password, new password and confirm password are required for password change.'
                })
            
            user = self.context['request'].user
            if not user.check_password(data['current_password']):
                raise serializers.ValidationError({
                    'current_password': 'Current password is not correct.'
                })
            
            if data['new_password'] != data['confirm_password']:
                raise serializers.ValidationError({
                    'new_password': 'New passwords do not match.'
                })
        
        return data

    def update(self, instance, validated_data):
        # Handle user data
        user_data = validated_data.pop('user', {})
        user = instance.user
        
        # Update user fields if provided
        for attr, value in user_data.items():
            setattr(user, attr, value)
        
        # Handle password change if all password fields are provided
        current_password = validated_data.pop('current_password', None)
        new_password = validated_data.pop('new_password', None)
        confirm_password = validated_data.pop('confirm_password', None)
        
        if all([current_password, new_password, confirm_password]):
            if new_password != confirm_password:
                raise serializers.ValidationError({"new_password": "The two password fields didn't match."})
            if not user.check_password(current_password):
                raise serializers.ValidationError({"current_password": "Incorrect current password."})
            user.set_password(new_password)
        
        # Handle avatar separately to trigger model's save method
        avatar = validated_data.pop('avatar', None)
        if avatar is not None:
            # If avatar is an empty string or None, delete the current avatar
            if avatar == '' or avatar is None:
                if instance.avatar:
                    instance.avatar.delete(save=False)
                    instance.avatar = None
            else:
                instance.avatar = avatar
        
        user.save()
        
        # Update remaining profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        instance.save()
        return instance
