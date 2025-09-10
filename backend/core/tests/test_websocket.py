"""Tests for WebSocket functionality.

This module contains tests for the WebSocket functionality in the application.
It covers the connection and message receiving functionality of the WebSocket consumer.
"""
import json
import pytest
from channels.testing import WebsocketCommunicator
from django.test import TestCase
from channels.routing import URLRouter
from django.urls import re_path
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.auth import get_user_model

from ..consumers import NotificationConsumer
from .. import notifications

# Get the User model
User = get_user_model()

# Create a test application
application = URLRouter([
    re_path(r'ws/notifications/(?P<user_id>\w+)/$', NotificationConsumer.as_asgi()),
])

# Use pytest.mark.asyncio for async test functions
pytestmark = pytest.mark.asyncio

class WebSocketTests(TestCase):
    """Test WebSocket consumer functionality."""
    
    @classmethod
    def setUpTestData(cls):
        # Set up data for the whole TestCase
        cls.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    async def test_connect_and_receive(self):
        """Test WebSocket connection and message receiving."""
        # Create a communicator for the test user
        communicator = WebsocketCommunicator(
            application,
            f'/ws/notifications/{self.user.id}/'
        )
        
        # Connect to the WebSocket
        connected, _ = await communicator.connect()
        self.assertTrue(connected, "Failed to connect to WebSocket")
        
        try:
            # Test receiving a message
            test_message = {
                'type': 'test',
                'message': 'Hello, WebSocket!',
                'data': {'key': 'value'}
            }
            await communicator.send_json_to(test_message)
            
            # Check the response
            response = await communicator.receive_json_from(timeout=5)  # Increased timeout
            self.assertEqual(response['message'], 'Hello, WebSocket!')
            self.assertEqual(response['data'], {'key': 'value'})
            
        finally:
            # Always close the connection
            await communicator.disconnect()
    
    async def test_notification_utility(self):
        """Test the notification utility functions with a real WebSocket connection."""
        # Create a communicator for the test user
        communicator = WebsocketCommunicator(
            application,
            f'/ws/notifications/{self.user.id}/'
        )
        
        # Connect to the WebSocket
        connected, _ = await communicator.connect()
        self.assertTrue(connected, "Failed to connect to WebSocket")
        
        try:
            # Use the notification utility to send a message
            channel_layer = get_channel_layer()
            await channel_layer.group_send(
                f'user_{self.user.id}',
                {
                    'type': 'send_notification',
                    'message': 'Test notification',
                    'notification_type': 'info',
                    'data': {'test': 'data'}
                }
            )
            
            # Check that we received the notification
            response = await communicator.receive_json_from(timeout=5)
            self.assertEqual(response['message'], 'Test notification')
            self.assertEqual(response['type'], 'info')
            self.assertEqual(response['data'], {'test': 'data'})
            
        finally:
            # Always close the connection
            await communicator.disconnect()
