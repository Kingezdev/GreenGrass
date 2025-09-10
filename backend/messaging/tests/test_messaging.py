from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from unittest.mock import patch

from rooms.models import Property
from messaging.models import Conversation, Message

User = get_user_model()

class MessagingTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create test users
        self.landlord = User.objects.create_user(
            email='landlord@example.com',
            password='testpass123',
            first_name='Landlord',
            last_name='User'
        )
        self.tenant = User.objects.create_user(
            email='tenant@example.com',
            password='testpass123',
            first_name='Tenant',
            last_name='User'
        )
        
        # Create user profiles
        from accounts.models import UserProfile
        UserProfile.objects.create(user=self.landlord, user_type='landlord')
        UserProfile.objects.create(user=self.tenant, user_type='tenant')
        
        # Create a test property
        self.property = Property.objects.create(
            title='Test Property',
            description='Test Description',
            price=1000,
            bedrooms=2,
            bathrooms=1,
            landlord=self.landlord
        )
        
        # Create a conversation
        self.conversation = Conversation.objects.create(
            landlord=self.landlord,
            tenant=self.tenant,
            property=self.property,
            subject='Test Conversation'
        )
        
        # URLs
        self.conversation_list_url = reverse('conversation-list')
        self.conversation_detail_url = reverse('conversation-detail', args=[self.conversation.id])
        self.message_create_url = reverse('message-create', args=[self.conversation.id])
        
        # Mock Pusher
        self.pusher_patcher = patch('core.pusher_service.pusher_service.trigger')
        self.mock_pusher_trigger = self.pusher_patcher.start()
        self.addCleanup(self.pusher_patcher.stop)
    
    def test_send_message(self):
        """Test sending a message and verify it's saved to the database"""
        self.client.force_authenticate(user=self.landlord)
        
        # Send a message
        response = self.client.post(
            self.message_create_url,
            {'content': 'Test message content'},
            format='json'
        )
        
        # Verify response
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['content'], 'Test message content')
        
        # Verify message is in the database
        message = Message.objects.first()
        self.assertEqual(message.content, 'Test message content')
        self.assertEqual(message.sender, self.landlord)
        self.assertEqual(message.conversation, self.conversation)
        
        # Verify Pusher was called
        self.mock_pusher_trigger.assert_called_once()
        
    def test_mark_messages_as_read(self):
        """Test that messages are marked as read when conversation is viewed"""
        # Create an unread message
        message = Message.objects.create(
            conversation=self.conversation,
            sender=self.tenant,
            content='Unread message',
            is_read=False
        )
        
        # Log in as landlord and view the conversation
        self.client.force_authenticate(user=self.landlord)
        response = self.client.get(self.conversation_detail_url)
        
        # Verify response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify message is now marked as read
        message.refresh_from_db()
        self.assertTrue(message.is_read)
        
        # Verify Pusher was called to notify the sender
        self.mock_pusher_trigger.assert_called_once()
        
    def test_unauthenticated_access(self):
        """Test that unauthenticated users can't access messaging endpoints"""
        # Try to access conversation list
        response = self.client.get(self.conversation_list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Try to send a message
        response = self.client.post(
            self.message_create_url,
            {'content': 'Test message'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_unauthorized_access(self):
        """Test that users can't access conversations they're not part of"""
        # Create another user
        other_user = User.objects.create_user(
            email='other@example.com',
            password='testpass123',
            first_name='Other',
            last_name='User'
        )
        UserProfile.objects.create(user=other_user, user_type='tenant')
        
        # Try to access the conversation
        self.client.force_authenticate(user=other_user)
        response = self.client.get(self.conversation_detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Try to send a message
        response = self.client.post(
            self.message_create_url,
            {'content': 'Test message'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
