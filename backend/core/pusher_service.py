import logging
import json
from django.conf import settings
import pusher

logger = logging.getLogger(__name__)

class PusherService:
    """
    A service class to handle Pusher real-time messaging.
    This provides a clean interface for sending real-time notifications.
    """
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(PusherService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance
    
    def _initialize(self):
        """Initialize the Pusher client with configuration from settings."""
        try:
            self.pusher = pusher.Pusher(
                app_id=settings.PUSHER_APP_ID,
                key=settings.PUSHER_KEY,
                secret=settings.PUSHER_SECRET,
                cluster=settings.PUSHER_CLUSTER,
                ssl=settings.PUSHER_SSL
            )
            logger.info("Pusher client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Pusher client: {str(e)}")
            raise
    
    def trigger(self, channels, event, data, socket_id=None):
        """
        Trigger an event on one or more channels.
        
        Args:
            channels (str|list): Channel or list of channels to trigger the event on
            event (str): Name of the event
            data (dict): Data to send with the event
            socket_id (str, optional): Socket ID to exclude from receiving the event
            
        Returns:
            dict: Response from Pusher API
        """
        try:
            if not isinstance(channels, list):
                channels = [channels]
                
            response = self.pusher.trigger(
                channels=channels,
                event_name=event,
                data=json.dumps(data),
                socket_id=socket_id
            )
            logger.debug(f"Pusher event triggered: {event} on channels {channels}")
            return response
            
        except Exception as e:
            logger.error(f"Failed to trigger Pusher event: {str(e)}")
            raise
    
    def authenticate_channel(self, channel_name, socket_id, custom_data=None):
        """
        Authenticate a private or presence channel.
        
        Args:
            channel_name (str): Name of the channel to authenticate
            socket_id (str): Socket ID of the connecting client
            custom_data (dict, optional): Custom data for presence channels
            
        Returns:
            dict: Authentication data for the client
        """
        try:
            if channel_name.startswith('presence-'):
                if not custom_data:
                    custom_data = {}
                auth = self.pusher.authenticate(
                    channel=channel_name,
                    socket_id=socket_id,
                    custom_data=custom_data
                )
            else:
                auth = self.pusher.authenticate(
                    channel=channel_name,
                    socket_id=socket_id
                )
                
            logger.debug(f"Authenticated channel: {channel_name}")
            return auth
            
        except Exception as e:
            logger.error(f"Failed to authenticate channel {channel_name}: {str(e)}")
            raise

# Create a singleton instance
pusher_service = PusherService()
