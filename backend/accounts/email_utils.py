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
    # Check rate limit
    if not check_email_rate_limit(user.email):
        logger.warning(f"Rate limit exceeded for email: {user.email}")
        raise ValidationError("Too many verification attempts. Please try again later.")
    
    # Invalidate any existing tokens for this user
    EmailVerificationToken.objects.filter(user=user, is_used=False).update(is_used=True)
    
    # Create a new verification token
    token_obj = EmailVerificationToken.objects.create(user=user)
    
    # Build verification URL using backend URL
    verification_path = reverse('verify-email', kwargs={'token': str(token_obj.token)})
    if request:
        verification_url = request.build_absolute_uri(verification_path)
    else:
        # Use backend URL directly instead of frontend URL
        backend_url = settings.BACKEND_URL or 'http://localhost:8000'
        verification_url = f"{backend_url}{verification_path}"
    
    # Prepare email context
    context = {
        'user': user,
        'verification_url': verification_url,
        'expiry_hours': 24,
        'support_email': settings.DEFAULT_FROM_EMAIL,
        'site_name': getattr(settings, 'SITE_NAME', 'Our Site'),
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
        token_obj.is_used = True
        token_obj.save()
        return False
