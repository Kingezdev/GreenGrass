# test_email.py
from accounts.utils import send_verification_email
from django.contrib.auth import get_user_model
import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HouseListing_Backend.settings')
django.setup()

User = get_user_model()
user = User.objects.last()

send_verification_email(user)
print("Task queued for user:", user.email)
