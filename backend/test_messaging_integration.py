import os
import sys
import json
import time
import pusher
from django.conf import settings

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HouseListing_Backend.settings')
import django
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token as AuthToken
from rest_framework.authtoken.views import ObtainAuthToken
from messaging.models import Conversation, Message
from accounts.models import UserProfile
from rooms.models import Property

User = get_user_model()

def print_step(step, message):
    print(f"\n{'='*10} {step} {'='*10}")
    print(message)
    print("=" * (len(step) + 22) + "\n")

def test_messaging_flow():
    # Create test client
    client = APIClient()
    
    # Create or get test users
    landlord, _ = User.objects.get_or_create(
        email='landlord@test.com',
        defaults={
            'username': 'landlord@test.com',
            'first_name': 'Test',
            'last_name': 'Landlord',
            'password': 'testpass123'
        }
    )
    landlord.set_password('testpass123')
    landlord.save()
    
    # Create or get landlord profile
    landlord_profile, _ = UserProfile.objects.get_or_create(
        user=landlord,
        defaults={'user_type': 'landlord'}
    )
    
    # Create or get tenant
    tenant, _ = User.objects.get_or_create(
        email='tenant@test.com',
        defaults={
            'username': 'tenant@test.com',
            'first_name': 'Test',
            'last_name': 'Tenant',
            'password': 'testpass123'
        }
    )
    tenant.set_password('testpass123')
    tenant.save()
    
    # Create or get tenant profile
    tenant_profile, _ = UserProfile.objects.get_or_create(
        user=tenant,
        defaults={'user_type': 'tenant'}
    )
    
    # Create test property
    property_obj = Property.objects.create(
        title='Test Property',
        description='Test Description',
        price=1000,
        bedrooms=2,
        bathrooms=1,
        area_sqft=1000,  # Added required field
        property_type='apartment',
        status='available',
        landlord=landlord
    )
    
    # Get or create auth tokens
    AuthToken.objects.filter(user=landlord).delete()
    AuthToken.objects.filter(user=tenant).delete()
    
    # Create new tokens
    landlord_token = AuthToken.objects.create(user=landlord)
    tenant_token = AuthToken.objects.create(user=tenant)
    
    # Set auth token for tenant
    client.credentials(HTTP_AUTHORIZATION=f'Token {tenant_token.key}')
    
    # Test 1: Create a conversation
    print_step("TEST 1", "Creating a new conversation")
    response = client.post(
        '/api/conversations/',
        {'property': property_obj.id, 'subject': 'Test Conversation'},
        format='json'
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.data, indent=2)}")
    
    if response.status_code != 201:
        print("Failed to create conversation")
        return False
    
    conversation_id = response.data['id']
    
    # Test 2: Send a message
    print_step("TEST 2", "Sending a message")
    response = client.post(
        f'/api/conversations/{conversation_id}/messages/',
        {'content': 'Hello, is this property still available?'},
        format='json'
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.data, indent=2)}")
    
    if response.status_code != 201:
        print("Failed to send message")
        return False
    
    # Test 3: Switch to landlord and respond
    print_step("TEST 3", "Switching to landlord and responding")
    client.credentials(HTTP_AUTHORIZATION=f'Token {landlord_token.key}')
    
    response = client.post(
        f'/api/conversations/{conversation_id}/messages/',
        {'content': 'Yes, it is still available. Would you like to schedule a viewing?'},
        format='json'
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.data, indent=2)}")
    
    if response.status_code != 201:
        print("Failed to send response message")
        return False
    
    # Test 4: Verify conversation list
    print_step("TEST 4", "Verifying conversation list")
    response = client.get('/api/conversations/')
    print(f"Status Code: {response.status_code}")
    print(f"Found {len(response.data)} conversations")
    print(f"First conversation: {json.dumps(response.data[0], indent=2) if response.data else 'None'}")
    
    if response.status_code != 200 or len(response.data) == 0:
        print("Failed to retrieve conversations")
        return False
    
    # Test 5: Verify Pusher integration (simulated)
    print_step("TEST 5", "Testing Pusher Integration (Simulated)")
    print("This would normally test real-time updates via Pusher")
    print("To test actual Pusher events, you'll need to:")
    print("1. Set up a Pusher client in the frontend")
    print("2. Listen for 'new_message' events")
    print("3. Verify messages appear in real-time")
    
    return True

if __name__ == "__main__":
    print("Starting messaging integration test...\n")
    success = test_messaging_flow()
    
    if success:
        print("\n✅ All tests passed! Messaging functionality is working correctly.")
        print("Note: For full real-time testing, verify with the frontend Pusher implementation.")
    else:
        print("\n❌ Some tests failed. Please check the output above for details.")
