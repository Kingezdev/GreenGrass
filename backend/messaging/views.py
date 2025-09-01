from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q, Max
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import Conversation, Message
from .serializers import (
    ConversationSerializer, ConversationCreateSerializer, ConversationDetailSerializer,
    MessageSerializer, MessageCreateSerializer
)
from accounts.models import UserProfile
from rooms.models import Property

class IsParticipantPermission(permissions.BasePermission):
    """
    Custom permission to only allow participants of a conversation to access it.
    """
    def has_object_permission(self, request, view, obj):
        return request.user == obj.landlord or request.user == obj.tenant

@method_decorator(csrf_exempt, name='dispatch')
class ConversationListCreateView(generics.ListCreateAPIView):
    """
    List user's conversations or create a new conversation
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ConversationCreateSerializer
        return ConversationSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(
            Q(landlord=user) | Q(tenant=user)
        ).distinct()
    
    def perform_create(self, serializer):
        # Auto-determine landlord and tenant based on current user
        user = self.request.user
        try:
            user_profile = UserProfile.objects.get(user=user)
            
            if user_profile.user_type == 'tenant':
                serializer.save(tenant=user)
            elif user_profile.user_type == 'landlord':
                serializer.save(landlord=user)
            else:
                return Response({"error": "Invalid user type"}, status=status.HTTP_400_BAD_REQUEST)
                
        except UserProfile.DoesNotExist:
            return Response({"error": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)

@method_decorator(csrf_exempt, name='dispatch')
class ConversationDetailView(generics.RetrieveAPIView):
    """
    Get conversation details with all messages
    """
    serializer_class = ConversationDetailSerializer
    permission_classes = [permissions.IsAuthenticated, IsParticipantPermission]
    
    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(
            Q(landlord=user) | Q(tenant=user)
        )
    
    def retrieve(self, request, *args, **kwargs):
        conversation = self.get_object()
        # Mark messages as read for the current user
        Message.objects.filter(
            conversation=conversation,
            is_read=False
        ).exclude(sender=request.user).update(is_read=True)
        
        return super().retrieve(request, *args, **kwargs)

@method_decorator(csrf_exempt, name='dispatch')
class MessageCreateView(generics.CreateAPIView):
    """
    Send a message in a conversation
    """
    serializer_class = MessageCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        conversation_id = self.kwargs['conversation_id']
        conversation = get_object_or_404(Conversation, id=conversation_id)
        
        # Check if user is participant
        if self.request.user not in [conversation.landlord, conversation.tenant]:
            return Response({"error": "You are not a participant in this conversation"}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        message = serializer.save(
            conversation=conversation,
            sender=self.request.user
        )
        
        # Update conversation timestamp
        conversation.save()
        
        # Return the created message with full details
        response_serializer = MessageSerializer(message, context={'request': self.request})
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

@method_decorator(csrf_exempt, name='dispatch')
class StartConversationView(APIView):
    """
    Start a conversation about a specific property
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        property_id = request.data.get('property_id')
        initial_message = request.data.get('message', '')
        subject = request.data.get('subject', '')
        
        if not property_id:
            return Response({"error": "Property ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            property_obj = Property.objects.get(id=property_id)
            user_profile = UserProfile.objects.get(user=request.user)
            
            if user_profile.user_type == 'tenant':
                landlord = property_obj.landlord
                tenant = request.user
            elif user_profile.user_type == 'landlord':
                # Landlord wants to contact tenant - need tenant_id
                tenant_id = request.data.get('tenant_id')
                if not tenant_id:
                    return Response({"error": "Tenant ID is required when landlord starts conversation"}, 
                                  status=status.HTTP_400_BAD_REQUEST)
                tenant = get_object_or_404(User, id=tenant_id)
                landlord = request.user
            else:
                return Response({"error": "Invalid user type"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if conversation already exists
            conversation, created = Conversation.objects.get_or_create(
                landlord=landlord,
                tenant=tenant,
                property=property_obj,
                defaults={'subject': subject or f"Inquiry about {property_obj.title}"}
            )
            
            # Send initial message if provided
            if initial_message:
                Message.objects.create(
                    conversation=conversation,
                    sender=request.user,
                    content=initial_message
                )
            
            # Update landlord's inquiry count if this is a new conversation
            if created:
                landlord_profile = UserProfile.objects.get(user=landlord)
                landlord_profile.total_inquiries_received += 1
                landlord_profile.save()
            
            serializer = ConversationDetailSerializer(conversation, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
            
        except Property.DoesNotExist:
            return Response({"error": "Property not found"}, status=status.HTTP_404_NOT_FOUND)
        except UserProfile.DoesNotExist:
            return Response({"error": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)

@method_decorator(csrf_exempt, name='dispatch')
class UnreadMessagesCountView(APIView):
    """
    Get count of unread messages for the current user
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        unread_count = Message.objects.filter(
            conversation__in=Conversation.objects.filter(
                Q(landlord=request.user) | Q(tenant=request.user)
            ),
            is_read=False
        ).exclude(sender=request.user).count()
        
        return Response({"unread_count": unread_count})
