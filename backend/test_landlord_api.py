import requests
import json
import os
from django.core.management import call_command
from django.core import mail
import re

# API configuration
BASE_URL = "http://localhost:8000"  # Update if your server is running on a different URL

# Endpoints
REGISTER_URL = f"{BASE_URL}/api/accounts/register/"
LOGIN_URL = f"{BASE_URL}/api/accounts/login/"
PROFILE_URL = f"{BASE_URL}/api/accounts/profile/"
LANDLORD_LIST_URL = f"{BASE_URL}/api/accounts/landlords/"

# Test user data
test_landlord = {
    "email": "test_landlord2@example.com",
    "password": "securepassword123",
    "password2": "securepassword123",
    "first_name": "Test",
    "last_name": "Landlord"
}

# Test configuration
VERIFICATION_ENABLED = True  # Set to False to skip email verification in tests

def print_step(step_number, description):
    print(f"\n{'-'*50}")
    print(f"STEP {step_number}: {description}")
    print(f"{'-'*50}")

def test_landlord_registration():
    print_step(1, "Testing Landlord Registration")
    print("Endpoint:", REGISTER_URL)
    print("Payload:", json.dumps(test_landlord, indent=2))
    
    try:
        response = requests.post(REGISTER_URL, json=test_landlord)
        print("\nResponse Status Code:", response.status_code)
        print("Response Body:", json.dumps(response.json(), indent=2))
        return response.status_code == 201
    except Exception as e:
        print("Error:", str(e))
        return False

def extract_verification_token(email):
    """Extract verification token from the email"""
    # In a real test, you would extract this from the email
    # For testing purposes, we'll get it from the database
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    try:
        user = User.objects.get(email=email)
        from accounts.models import EmailVerificationToken
        token_obj = EmailVerificationToken.objects.filter(user=user, is_used=False).first()
        return str(token_obj.token) if token_obj else None
    except Exception as e:
        print(f"Error extracting verification token: {e}")
        return None

def verify_email(email):
    """Verify the email using the verification token"""
    token = extract_verification_token(email)
    if not token:
        print("No verification token found")
        return False
    
    verify_url = f"{BASE_URL}/api/accounts/verify-email/{token}/"
    print("Verification URL:", verify_url)
    
    try:
        response = requests.get(verify_url)
        print("Verification Status Code:", response.status_code)
        print("Verification Response:", response.text)
        return response.status_code in [200, 302]
    except Exception as e:
        print("Verification Error:", str(e))
        return False

def test_landlord_login():
    print_step(2, "Testing Landlord Login")
    login_data = {
        "email": test_landlord["email"],
        "password": test_landlord["password"]
    }
    print("Endpoint:", LOGIN_URL)
    print("Payload:", json.dumps(login_data, indent=2))
    
    response = requests.post(LOGIN_URL, json=login_data)
    print("\nResponse Status Code:", response.status_code)
    
    # If login fails due to unverified email and verification is enabled
    if response.status_code == 403 and VERIFICATION_ENABLED:
        print("Email not verified. Attempting to verify...")
        if verify_email(test_landlord["email"]):
            print("Email verified. Retrying login...")
            response = requests.post(LOGIN_URL, json=login_data)
            print("Retry Login Status Code:", response.status_code)
    
    try:
        response_data = response.json()
        print("Response Body:", json.dumps(response_data, indent=2))
        
        if response.status_code == 200:
            return response_data.get("access"), response_data.get("refresh")
        return None, None
    except Exception as e:
        print("Error:", str(e))
        return None, None

def test_get_landlord_profile(access_token):
    print_step(3, "Testing Get Landlord Profile")
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    print("Endpoint:", PROFILE_URL)
    print("Headers:", json.dumps(headers, indent=2))
    
    try:
        response = requests.get(PROFILE_URL, headers=headers)
        print("\nResponse Status Code:", response.status_code)
        print("Response Body:", json.dumps(response.json(), indent=2))
        return response.status_code == 200
    except Exception as e:
        print("Error:", str(e))
        return False

def test_list_landlords(access_token):
    print_step(4, "Testing List All Landlords")
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    print("Endpoint:", LANDLORD_LIST_URL)
    print("Headers:", json.dumps(headers, indent=2))
    
    try:
        response = requests.get(LANDLORD_LIST_URL, headers=headers)
        print("\nResponse Status Code:", response.status_code)
        print("Response Body:", json.dumps(response.json(), indent=2))
        return response.status_code == 200
    except Exception as e:
        print("Error:", str(e))
        return False

def setup_django():
    """Setup Django environment"""
    import os
    import django
    import sys
    
    # Add the project directory to the Python path
    project_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend'))
    sys.path.append(project_path)
    
    # Set the Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HouseListing_Backend.settings')
    django.setup()

if __name__ == "__main__":
    # Setup Django environment
    setup_django()
    
    print("="*60)
    print("LANDLORD API TESTING")
    print("="*60)
    
    # Test registration
    if test_landlord_registration():
        print("\n✅ Registration test passed!")
    else:
        print("\n❌ Registration test failed!")
    
    # If email verification is enabled, verify the email first
    if VERIFICATION_ENABLED:
        print("\n🔍 Email verification is enabled. Verifying email...")
        if verify_email(test_landlord["email"]):
            print("✅ Email verified successfully!")
        else:
            print("❌ Email verification failed!")
    
    # Test login
    access_token, refresh_token = test_landlord_login()
    if access_token:
        print("\n✅ Login test passed!")
        print(f"Access Token: {access_token[:50]}...")
        print(f"Refresh Token: {refresh_token[:50]}...")
        
        # Test getting profile
        if test_get_landlord_profile(access_token):
            print("\n✅ Get profile test passed!")
        else:
            print("\n❌ Get profile test failed!")
        
        # Test listing landlords
        if test_list_landlords(access_token):
            print("\n✅ List landlords test passed!")
        else:
            print("\n❌ List landlords test failed!")
    else:
        print("\n❌ Login test failed!")
    
    print("\n" + "="*60)
    print("TESTING COMPLETED")
    print("="*60)
