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

    class Meta:
        model = User
        fields = ('email', 'password', 'password2', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_active=False
        )
        user.set_password(validated_data['password'])
        user.save()
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
    email = serializers.EmailField(source='user.email')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    is_verified = serializers.BooleanField(source='user.is_verified')
    date_joined = serializers.DateTimeField(source='user.date_joined')
    date_of_birth = serializers.DateField()  # profile field

    class Meta:
        model = UserProfile
        fields = ('email', 'first_name', 'last_name', 'phone_number', 
                  'avatar', 'bio', 'date_of_birth', 'is_verified', 'date_joined')


class ProfileUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    current_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    new_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    confirm_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    date_of_birth = serializers.DateField(required=False)  # profile field

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
        user_data = validated_data.pop('user', {})
        user = instance.user

        # Update user fields
        for attr, value in user_data.items():
            setattr(user, attr, value)
        
        # Update password if provided
        if 'new_password' in validated_data and validated_data['new_password']:
            user.set_password(validated_data['new_password'])
        
        user.save()

        # Update profile fields
        return super().update(instance, validated_data)
