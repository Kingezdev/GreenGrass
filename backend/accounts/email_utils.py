import logging
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.urls import reverse
from django.utils import timezone
from .models import EmailVerificationToken, User

logger = logging.getLogger(__name__)

def send_verification_email(user, request=None):
    """
    Send an email with a verification link to the user's email address.
    
    Args:
        user: The user instance to send the verification email to
        request: Optional request object for building absolute URLs
    
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    try:
        # Invalidate any existing tokens for this user
        EmailVerificationToken.objects.filter(user=user, is_used=False).update(is_used=True)
        
        # Create a new verification token
        token_obj = EmailVerificationToken.objects.create(user=user)
        
        # Build verification URL
        verification_path = reverse('verify-email', kwargs={'token': str(token_obj.token)})
        if request:
            verification_url = request.build_absolute_uri(verification_path)
        else:
            verification_url = f"{settings.FRONTEND_URL}{verification_path}"
        
        # Prepare email context
        context = {
            'user': user,
            'verification_url': verification_url,
            'expiry_hours': 24,  # Token expiry time in hours
            'support_email': settings.DEFAULT_FROM_EMAIL,
            'site_name': getattr(settings, 'SITE_NAME', 'Our Site'),
        }
        
        # Render email content
        subject = f"Verify Your Email Address - {context['site_name']}"
        html_message = render_to_string('emails/verify_email.html', context)
        plain_message = strip_tags(html_message)
        
        # Send email
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f"Verification email sent to {user.email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send verification email to {user.email}: {str(e)}", 
                    exc_info=True)
        # In case of any error, mark the token as used to prevent issues
        if 'token_obj' in locals():
            token_obj.is_used = True
            token_obj.save()
        return False
