import json
import logging
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone

from .pusher_service import pusher_service

logger = logging.getLogger(__name__)
User = get_user_model()

class NotificationConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for handling real-time notifications using Pusher.
    This consumer now serves as a bridge between the client and Pusher.
    """
    
    async def connect(self):
        """Handle WebSocket connection for Pusher authentication."""
        try:
            self.user_id = self.scope['url_route']['kwargs']['user_id']
            self.user = await self.get_user(self.user_id)
            
            if not self_user:
                await self.close(code=4001)  # Custom close code for invalid user
                return
                
            # Accept the connection
            await self.accept()
            logger.info(f"Pusher auth connected for user {self.user_id}")
            
        except Exception as e:
            logger.error(f"Error in Pusher auth connection: {str(e)}")
            await self.close(code=4000)
            
    async def receive(self, text_data=None, bytes_data=None):
        """Handle incoming WebSocket messages for Pusher authentication."""
        if not text_data:
            logger.warning("Received empty message")
            return
            
        try:
            data = json.loads(text_data)
            socket_id = data.get('socket_id')
            channel_name = data.get('channel_name')
            
            if not socket_id or not channel_name:
                await self.send_error("Missing required parameters")
                return
                
            # Authenticate the channel
            auth_data = pusher_service.authenticate_channel(
                channel_name=channel_name,
                socket_id=socket_id,
                custom_data={
                    'user_id': str(self.user_id),
                    'user_info': {
                        'id': str(self.user.id),
                        'email': self.user.email
                    }
                } if channel_name.startswith('presence-') else None
            )
            
            await self.send(text_data=json.dumps(auth_data))
            
        except json.JSONDecodeError:
            logger.error("Invalid JSON received")
            await self.send_error("Invalid JSON format")
        except Exception as e:
            logger.exception("Error processing Pusher auth")
            await self.send_error("Authentication failed")
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection."""
        logger.info(f"Pusher auth disconnected for user {getattr(self, 'user_id', 'unknown')} (code: {close_code})")
    
    async def send_error(self, message):
        """Send an error message to the client."""
        await self.send(text_data=json.dumps({
            'error': message,
            'status': 'error'
        }))
    
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
        """Get a user by ID."""
        try:
            return User.objects.get(id=user_id, is_active=True)
        except User.DoesNotExist:
            logger.warning(f"User not found or inactive: {user_id}")
            return None
