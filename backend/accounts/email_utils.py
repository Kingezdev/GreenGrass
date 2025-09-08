import logging
import random
from datetime import timedelta
from django.core.cache import cache
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.urls import reverse
from django.utils import timezone
from django.core.exceptions import ValidationError
from .models import EmailVerificationToken, User
import os

logger = logging.getLogger(__name__)

def check_email_rate_limit(email, limit=5, period=3600):
    """
    Check if the email sending rate limit has been exceeded.
    
    Args:
        email: The email address to check
        limit: Maximum number of emails allowed in the period
        period: Time period in seconds
        
    Returns:
        bool: True if rate limit is not exceeded, False otherwise
    """
    cache_key = f'email_rate_limit:{email}'
    count = cache.get(cache_key, 0)
    
    if count >= limit:
        return False
        
    cache.set(cache_key, count + 1, period)
    return True

def send_verification_email(user, request=None, **kwargs):
    """
    Send an email with a verification link to the user's email address.
    
    Args:
        user: The user instance to send the verification email to
        request: Optional request object for building absolute URLs
        **kwargs: Additional arguments to pass to the email sending function
        
    Returns:
        bool: True if email was sent successfully
    """
    from django.conf import settings
    
    # Check rate limit
    if not check_email_rate_limit(user.email):
        logger.warning(f"Rate limit exceeded for email: {user.email}")
        raise ValidationError("Too many verification attempts. Please try again later.")
    
    # Invalidate any existing tokens for this user
    EmailVerificationToken.objects.filter(user=user, is_used=False).update(is_used=True)
    
    # Create a new verification token
    token_obj = EmailVerificationToken.objects.create(user=user)
    
    # Always use production URL for email verification
    production_url = 'https://greengrass-backend.onrender.com'
    verification_url = f"{production_url}/api/accounts/verify-email/{token_obj.token}/"
    logger.info(f"Using production verification URL: {verification_url}")
    
    return _prepare_and_send_verification_email(user, verification_url, **kwargs)

def send_local_verification_email(user, request=None, **kwargs):
    """
    Send an email with a verification link to the user's email address using localhost.
    This is intended for local development only.
    
    Args:
        user: The user instance to send the verification email to
        request: Optional request object for building absolute URLs
        **kwargs: Additional arguments to pass to the email sending function
        
    Returns:
        bool: True if email was sent successfully
    """
    # Check rate limit
    if not check_email_rate_limit(user.email):
        logger.warning(f"Rate limit exceeded for email: {user.email}")
        raise ValidationError("Too many verification attempts. Please try again later.")
    
    # Invalidate any existing tokens for this user
    EmailVerificationToken.objects.filter(user=user, is_used=False).update(is_used=True)
    
    # Create a new verification token
    token_obj = EmailVerificationToken.objects.create(user=user)
    
    # Use localhost URL for email verification
    local_url = 'http://localhost:8000'  # Default Django development server
    if os.environ.get('DJANGO_SETTINGS_MODULE') == 'config.settings.local':
        from config.settings.local import ALLOWED_HOSTS
        if ALLOWED_HOSTS and ALLOWED_HOSTS[0] != '*':
            local_url = f"http://{ALLOWED_HOSTS[0]}:8000"
    
    verification_url = f"{local_url}/api/accounts/verify-email/{token_obj.token}/"
    logger.info(f"Using local development verification URL: {verification_url}")
    
    return _prepare_and_send_verification_email(user, verification_url, **kwargs)

def _prepare_and_send_verification_email(user, verification_url, **kwargs):
    """
    Internal function to prepare and send the verification email.
    This is a helper function used by both production and local email sending functions.
    """
    # Prepare email context
    site_name = getattr(settings, 'SITE_NAME', 'Our Site')
    support_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@example.com')
    expiry_hours = settings.EMAIL_VERIFICATION_TOKEN_EXPIRY // 3600  # Convert to hours
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
    
    context = {
        'user': user,
        'verification_url': verification_url,
        'site_name': site_name,
        'support_email': support_email,
        'expiry_hours': expiry_hours,
    }
    
    subject = f"Verify Your Email Address - {context['site_name']}"
    html_message = render_to_string('emails/verify_email.html', context)
    plain_message = strip_tags(html_message)
    
    try:
        # Send email synchronously
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
            **kwargs
        )
        logger.info(f"Verification email sent to {user.email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send verification email to {user.email}: {str(e)}")
        # Mark token as used to prevent issues
        EmailVerificationToken.objects.filter(
            user=user, 
            is_used=False
        ).update(is_used=True)
        return False
    
    # This code is no longer needed as it's handled by _prepare_and_send_verification_email
