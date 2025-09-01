from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import UserProfile

User = get_user_model()

class LandlordRegistrationTest(APITestCase):
    def setUp(self):
        self.client = Client()
        self.register_url = reverse('register')
        self.valid_payload = {
            'username': 'testlandlord',
            'email': 'landlord@example.com',
            'password': 'testpass123',
            'user_type': 'landlord',
            'phone_number': '+1234567890',
            'first_name': 'Test',
            'last_name': 'Landlord'
        }

    def test_landlord_registration_success(self):
        """Test successful landlord registration"""
        response = self.client.post(
            self.register_url,
            data=self.valid_payload,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check user was created
        user = User.objects.get(username='testlandlord')
        self.assertIsNotNone(user)
        
        # Check user profile was created with correct type
        profile = UserProfile.objects.get(user=user)
        self.assertEqual(profile.user_type, 'landlord')
        self.assertEqual(profile.phone_number, '+1234567890')
        
        # Check response data
        self.assertEqual(response.data['user_type'], 'landlord')
        self.assertEqual(response.data['username'], 'testlandlord')
        self.assertEqual(response.data['email'], 'landlord@example.com')

    def test_duplicate_username(self):
        """Test registration with duplicate username"""
        # First registration
        self.client.post(self.register_url, data=self.valid_payload, format='json')
        
        # Try with same username, different email
        duplicate_payload = self.valid_payload.copy()
        duplicate_payload['email'] = 'different@example.com'
        
        response = self.client.post(
            self.register_url,
            data=duplicate_payload,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_missing_user_type(self):
        """Test registration without user_type"""
        invalid_payload = self.valid_payload.copy()
        del invalid_payload['user_type']
        
        response = self.client.post(
            self.register_url,
            data=invalid_payload,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('user_type', response.data)

    def test_invalid_user_type(self):
        """Test registration with invalid user_type"""
        invalid_payload = self.valid_payload.copy()
        invalid_payload['user_type'] = 'invalid_type'
        
        response = self.client.post(
            self.register_url,
            data=invalid_payload,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('user_type', response.data)

    def test_landlord_can_create_property(self):
        """Test that registered landlord can create a property"""
        # Register landlord
        self.client.post(self.register_url, data=self.valid_payload, format='json')
        
        # Login
        login_response = self.client.post(
            reverse('login'),
            data={
                'username': 'testlandlord',
                'password': 'testpass123'
            },
            format='json'
        )
        
        token = login_response.data['access']
        
        # Try to create property
        property_data = {
            'title': 'Test Property',
            'description': 'A test property',
            'price': 1000,
            'bedrooms': 2,
            'bathrooms': 1,
            'address': '123 Test St',
            'city': 'Test City',
            'state': 'TS',
            'zip_code': '12345',
            'is_available': True
        }
        
        response = self.client.post(
            reverse('property-list'),
            data=property_data,
            HTTP_AUTHORIZATION=f'Bearer {token}',
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Test Property')
