from rest_framework import serializers
from .models import Conversation, Message
from accounts.models import UserProfile
from django.contrib.auth.models import User

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    sender_type = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ('id', 'content', 'sender', 'sender_name', 'sender_type', 'is_read', 'created_at')
        read_only_fields = ('id', 'sender', 'created_at')
    
    def get_sender_type(self, obj):
        try:
            profile = UserProfile.objects.get(user=obj.sender)
            return profile.user_type
        except UserProfile.DoesNotExist:
            return None

class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('content',)

class ConversationSerializer(serializers.ModelSerializer):
    landlord_name = serializers.CharField(source='landlord.username', read_only=True)
    tenant_name = serializers.CharField(source='tenant.username', read_only=True)
    property_title = serializers.CharField(source='property.title', read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = ('id', 'landlord', 'tenant', 'property', 'subject', 'landlord_name', 
                 'tenant_name', 'property_title', 'last_message', 'unread_count', 
                 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def get_last_message(self, obj):
        last_message = obj.messages.last()
        if last_message:
            return {
                'content': last_message.content,
                'sender_name': last_message.sender.username,
                'created_at': last_message.created_at
            }
        return None
    
    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0

class ConversationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ('tenant', 'landlord', 'property', 'subject')
    
    def validate(self, data):
        # Ensure tenant and landlord have correct user types
        tenant = data.get('tenant')
        landlord = data.get('landlord')
        
        try:
            tenant_profile = UserProfile.objects.get(user=tenant)
            landlord_profile = UserProfile.objects.get(user=landlord)
            
            if tenant_profile.user_type != 'tenant':
                raise serializers.ValidationError("Selected user is not a tenant")
            if landlord_profile.user_type != 'landlord':
                raise serializers.ValidationError("Selected user is not a landlord")
                
        except UserProfile.DoesNotExist:
            raise serializers.ValidationError("User profile not found")
        
        return data

class ConversationDetailSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    landlord_name = serializers.CharField(source='landlord.username', read_only=True)
    tenant_name = serializers.CharField(source='tenant.username', read_only=True)
    property_title = serializers.CharField(source='property.title', read_only=True)
    
    class Meta:
        model = Conversation
        fields = ('id', 'landlord', 'tenant', 'property', 'subject', 'landlord_name', 
                 'tenant_name', 'property_title', 'messages', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
