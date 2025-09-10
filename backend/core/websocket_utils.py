from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

def send_notification(user_id, message, notification_type='info'):
    """
    Send a WebSocket notification to a specific user.
    
    Args:
        user_id: The ID of the user to send the notification to
        message: The message content
        notification_type: Type of notification (e.g., 'info', 'success', 'error', 'warning')
    """
    channel_layer = get_channel_layer()
    group_name = f'user_{user_id}'
    
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            'type': 'notification_message',
            'message': message,
            'notification_type': notification_type
        }
    )

def broadcast_notification(user_ids, message, notification_type='info'):
    """
    Send a WebSocket notification to multiple users.
    
    Args:
        user_ids: List of user IDs to send the notification to
        message: The message content
        notification_type: Type of notification (e.g., 'info', 'success', 'error', 'warning')
    """n    for user_id in user_ids:
        send_notification(user_id, message, notification_type)
