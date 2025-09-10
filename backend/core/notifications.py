"""
Notification utilities for sending real-time updates via WebSockets.
"""
import json
import logging
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils import timezone

logger = logging.getLogger(__name__)

def get_user_group_name(user_id):
    """Get the channel group name for a user."""
    return f'user_{user_id}'

def send_notification(user_id, message, notification_type='info', data=None):
    """
    Send a real-time notification to a specific user.
    
    Args:
        user_id: ID of the user to notify
        message: The notification message
        notification_type: Type of notification (e.g., 'info', 'success', 'error', 'warning')
        data: Additional data to include with the notification
    """
    if data is None:
        data = {}
    
    channel_layer = get_channel_layer()
    group_name = get_user_group_name(user_id)
    
    notification = {
        'type': 'send_notification',
        'message': message,
        'notification_type': notification_type,
        'data': data,
        'timestamp': str(timezone.now())
    }
    
    try:
        async_to_sync(channel_layer.group_send)(group_name, notification)
        logger.debug(f"Sent notification to user {user_id}: {message}")
        return True
    except Exception as e:
        logger.error(f"Error sending notification to user {user_id}: {str(e)}")
        return False

def broadcast_notification(user_ids, message, notification_type='info', data=None):
    """
    Send a notification to multiple users.
    
    Args:
        user_ids: List of user IDs to notify
        message: The notification message
        notification_type: Type of notification
        data: Additional data to include with the notification
    """
    results = []
    for user_id in user_ids:
        result = send_notification(user_id, message, notification_type, data)
        results.append((user_id, result))
    return results

class NotificationTypes:
    """Common notification types."""
    INFO = 'info'
    SUCCESS = 'success'
    WARNING = 'warning'
    ERROR = 'error'
    MESSAGE = 'message'
    SYSTEM = 'system'
    PAYMENT = 'payment'
    BOOKING = 'booking'
    MAINTENANCE = 'maintenance'
