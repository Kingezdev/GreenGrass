import os
import sys
import json
import logging
from django.conf import settings

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HouseListing_Backend.settings')
import django
django.setup()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_pusher_connection():
    """Test Pusher connection and send a test message."""
    try:
        from core.pusher_service import pusher_service
        
        # Test channel and event
        channel = 'test-channel'
        event = 'test-event'
        test_message = {
            'message': 'Hello from Pusher!',
            'timestamp': str(settings.TIME_ZONE)
        }
        
        logger.info(f"Sending test message to channel '{channel}' with event '{event}'")
        logger.info(f"Message: {json.dumps(test_message, indent=2)}")
        
        # Send the message
        response = pusher_service.trigger(
            channels=channel,
            event=event,
            data=test_message
        )
        
        logger.info("Message sent successfully!")
        logger.info(f"Pusher response: {json.dumps(response, indent=2)}")
        return True
        
    except Exception as e:
        logger.error(f"Error testing Pusher: {str(e)}")
        return False

if __name__ == "__main__":
    print("Testing Pusher integration...\n")
    success = test_pusher_connection()
    
    if success:
        print("\n✅ Pusher test completed successfully!")
        print("Check your Pusher dashboard to verify the test message was received.")
    else:
        print("\n❌ Pusher test failed. Check the logs above for details.")
    
    print("\nNote: Make sure you have set all the required Pusher environment variables in your .env file.")
