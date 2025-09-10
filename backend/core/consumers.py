import json
import logging
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone

logger = logging.getLogger(__name__)
User = get_user_model()

class NotificationConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for handling real-time notifications.
    Handles connection, disconnection, and message routing for WebSocket clients.
    """
    
    async def connect(self):
        """Handle WebSocket connection."""
        try:
            self.user_id = self.scope['url_route']['kwargs']['user_id']
            self.room_group_name = f'user_{self.user_id}'
            self.user = await self.get_user(self.user_id)
            
            if not self.user:
                await self.close(code=4001)  # Custom close code for invalid user
                return
                
            # Store connection time for tracking
            self.connect_time = timezone.now()
            
            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            
            await self.accept()
            logger.info(f"WebSocket connected: {self.channel_name} for user {self.user_id}")
            
            # Send a welcome message
            await self.send_notification(
                "Connected to notification service",
                'connection',
                {'status': 'connected', 'timestamp': str(timezone.now())}
            )
            
        except Exception as e:
            logger.error(f"Error in WebSocket connection: {str(e)}")
            await self.close(code=4000)  # Custom close code for connection error

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection."""
        if hasattr(self, 'room_group_name') and hasattr(self, 'channel_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            logger.info(f"WebSocket disconnected: {self.channel_name} (code: {close_code})")

    async def receive(self, text_data=None, bytes_data=None):
        """Handle incoming WebSocket messages."""
        if not text_data:
            logger.warning("Received empty message")
            return
            
        try:
            data = json.loads(text_data)
            message_type = data.get('type', 'notification')
            
            # Handle different types of messages
            if message_type == 'ping':
                await self.handle_ping()
            elif message_type == 'ack':
                await self.handle_acknowledgment(data)
            else:
                await self.handle_notification(data)
                
        except json.JSONDecodeError:
            logger.error("Invalid JSON received")
            await self.send_error("Invalid JSON format")
        except Exception as e:
            logger.exception("Error processing message")
            await self.send_error("Internal server error")
    
    async def handle_ping(self):
        """Handle ping messages for connection health checks."""
        await self.send_json({
            'type': 'pong',
            'timestamp': str(timezone.now())
        })
    
    async def handle_acknowledgment(self, data):
        """Handle message acknowledgments from the client."""
        message_id = data.get('message_id')
        if message_id:
            logger.info(f"Received ack for message {message_id}")
            # Here you could update the message status in your database
    
    async def handle_notification(self, data):
        """Handle incoming notification messages."""
        message = data.get('message', '')
        notification_type = data.get('notification_type', 'info')
        extra_data = data.get('data', {})
        
        # Broadcast to the user's room
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_notification',
                'message': message,
                'notification_type': notification_type,
                'data': extra_data,
                'timestamp': str(timezone.now())
            }
        )
    
    async def send_notification(self, event):
        """Send notification to WebSocket client."""
        await self.send(text_data=json.dumps({
            'type': event.get('notification_type', 'notification'),
            'message': event['message'],
            'data': event.get('data', {}),
            'timestamp': event.get('timestamp', str(timezone.now()))
        }))
    
    async def send_error(self, error_message):
        """Send error message to WebSocket client."""
        await self.send(text_data=json.dumps({
            'type': 'error',
            'message': error_message,
            'timestamp': str(timezone.now())
        }))
    
    async def send_json(self, data):
        """Helper method to send JSON data."""
        await self.send(text_data=json.dumps(data))

    @database_sync_to_async
    def get_user(self, user_id):
        """Get user by ID."""
        try:
            return User.objects.get(id=user_id)
        except ObjectDoesNotExist:
            logger.warning(f"User with ID {user_id} not found")
            return None
        except Exception as e:
            logger.error(f"Error fetching user {user_id}: {str(e)}")
            return None
