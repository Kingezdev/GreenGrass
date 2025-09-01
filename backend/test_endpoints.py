import requests
import json
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "http://127.0.0.1:8000/api"

class APITester:
    def __init__(self):
        self.session = requests.Session()
        self.token = None
        self.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    
    def set_auth_header(self, token: str):
        self.headers["Authorization"] = f"Bearer {token}"
    
    def print_response(self, method: str, endpoint: str, response):
        print(f"\n{'='*50}")
        print(f"{method} {endpoint}")
        print(f"Status Code: {response.status_code}")
        try:
            print("Response:", json.dumps(response.json(), indent=2))
        except:
            print("Response:", response.text)
    
    def test_endpoint(self, method: str, endpoint: str, data: Optional[Dict[str, Any]] = None, 
                     auth_required: bool = False, **kwargs):
        url = f"{BASE_URL}{endpoint}"
        headers = self.headers.copy()
        
        if auth_required and not self.token:
            print(f"Skipping {method} {endpoint} - Not authenticated")
            return None
            
        try:
            if method.upper() == 'GET':
                response = self.session.get(url, headers=headers, **kwargs)
            elif method.upper() == 'POST':
                response = self.session.post(url, json=data, headers=headers, **kwargs)
            elif method.upper() == 'PUT':
                response = self.session.put(url, json=data, headers=headers, **kwargs)
            elif method.upper() == 'DELETE':
                response = self.session.delete(url, headers=headers, **kwargs)
            else:
                print(f"Unsupported method: {method}")
                return None
                
            self.print_response(method, endpoint, response)
            return response
            
        except Exception as e:
            print(f"Error testing {method} {endpoint}: {str(e)}")
            return None
    
    def test_authentication(self):
        print("\n" + "="*50)
        print("TESTING AUTHENTICATION ENDPOINTS")
        print("="*50)
        
        # Test registration
        user_data = {
            "username": "testuser1",
            "email": "test1@example.com",
            "password": "testpassword1231",
            "password2": "testpassword1231",
            "user_type": "tenant"
        }
        response = self.test_endpoint('POST', '/accounts/register/', user_data)
        
        # Test login
        login_data = {
            "username": "testuser1",
            "password": "testpassword1231"
        }
        response = self.test_endpoint('POST', '/accounts/login/', login_data)
        
        if response and response.status_code == 200:
            self.token = response.json().get('access')
            self.set_auth_header(self.token)
            print("\nSuccessfully authenticated!")
    
    def test_user_endpoints(self):
        if not self.token:
            print("Skipping user endpoints - Not authenticated")
            return
            
        print("\n" + "="*50)
        print("TESTING USER ENDPOINTS")
        print("="*50)
        
        # Get current user profile
        self.test_endpoint('GET', '/accounts/profile/', auth_required=True)
        
        # List all landlords
        self.test_endpoint('GET', '/accounts/landlords/', auth_required=True)
    
    def test_property_endpoints(self):
        if not self.token:
            print("Skipping property endpoints - Not authenticated")
            return
            
        print("\n" + "="*50)
        print("TESTING PROPERTY ENDPOINTS")
        print("="*50)
        
        # List all properties
        self.test_endpoint('GET', '/core/properties/', auth_required=True)
        
        # Create a new property
        property_data = {
            "title": "Test Property",
            "description": "A beautiful test property",
            "price": 1000,
            "bedrooms": 2,
            "bathrooms": 1,
            "address": "123 Test St",
            "city": "Test City",
            "is_available": True
        }
        response = self.test_endpoint('POST', '/core/properties/', property_data, auth_required=True)
        
        # Get property details if created
        if response and response.status_code == 201:
            property_id = response.json().get('id')
            self.test_endpoint('GET', f'/core/properties/{property_id}/', auth_required=True)
    
    def test_room_endpoints(self):
        if not self.token:
            print("Skipping room endpoints - Not authenticated")
            return
            
        print("\n" + "="*50)
        print("TESTING ROOM ENDPOINTS")
        print("="*50)
        
        # List all rooms
        self.test_endpoint('GET', '/rooms/properties/', auth_required=True)
        
        # Get user's properties
        self.test_endpoint('GET', '/rooms/my-properties/', auth_required=True)
    
    def test_messaging_endpoints(self):
        if not self.token:
            print("Skipping messaging endpoints - Not authenticated")
            return
            
        print("\n" + "="*50)
        print("TESTING MESSAGING ENDPOINTS")
        print("="*50)
        
        # List conversations
        self.test_endpoint('GET', '/messaging/conversations/', auth_required=True)
        
        # Start a new conversation (would need a valid recipient_id)
        # conversation_data = {
        #     "recipient_id": 2,
        #     "message": "Hello, I'm interested in your property!"
        # }
        # self.test_endpoint('POST', '/messaging/start-conversation/', conversation_data, auth_required=True)

def main():
    tester = APITester()
    
    # Run tests
    tester.test_authentication()
    tester.test_user_endpoints()
    tester.test_property_endpoints()
    tester.test_room_endpoints()
    tester.test_messaging_endpoints()
    
    print("\n" + "="*50)
    print("TESTING COMPLETE")
    print("="*50)

if __name__ == "__main__":
    main()
