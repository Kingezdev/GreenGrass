"""
Simple test script to verify WebSocket functionality.
Run this script to test the WebSocket connection manually.
"""
import asyncio
import websockets
import json
import sys
import os
import time

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configure logging
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_websocket():
    """Test WebSocket connection and message exchange."""
    # Use the correct WebSocket URL based on your routing
    user_id = 1  # Test with user ID 1
    uri = f"ws://localhost:8000/ws/notifications/{user_id}/"
    
    logger.info(f"Connecting to WebSocket at: {uri}")
    
    try:
        # Add connection timeout
        async with websockets.connect(uri, ping_interval=None, ping_timeout=10) as websocket:
            logger.info("Successfully connected to WebSocket server")
            
            # Send a test message
            test_message = {
                'type': 'test',
                'message': 'Hello, WebSocket!',
                'data': {'key': 'value'}
            }
            logger.info(f"Sending message: {test_message}")
            await websocket.send(json.dumps(test_message))
            
            # Wait for response with timeout
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                logger.info(f"Received response: {response}")
                return True
            except asyncio.TimeoutError:
                logger.warning("No response received within timeout period")
                return False
                
    except websockets.exceptions.InvalidURI as e:
        logger.error(f"Invalid WebSocket URI: {e}")
    except websockets.exceptions.InvalidStatusCode as e:
        logger.error(f"WebSocket connection failed with status code: {e.status_code}")
        logger.error(f"Response headers: {e.response_headers}")
    except websockets.exceptions.ConnectionClosed as e:
        logger.error(f"WebSocket connection closed unexpectedly: {e}")
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
    
    return False

if __name__ == "__main__":
    print("Testing WebSocket connection...")
    # Create a new event loop for the current thread
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        result = loop.run_until_complete(test_websocket())
        if result:
            print("✅ WebSocket test completed successfully!")
        else:
            print("❌ WebSocket test failed. Check logs for details.")
    except Exception as e:
        print(f"❌ Error during WebSocket test: {e}")
    finally:
        # Close the loop when done
        loop.close()
