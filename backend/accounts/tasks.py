from celery import shared_task
from django.core.management import call_command
from django.core.mail import send_mail
from celery.utils.log import get_task_logger
from django.conf import settings
from .models import User

logger = get_task_logger(__name__)

@shared_task(bind=True, max_retries=3, default_retry_delay=300)
def send_verification_email_async(self, user_id, subject, plain_message, html_message, **kwargs):
    """
    Celery task to send verification email asynchronously.
    
    Args:
        user_id: ID of the user to send the email to
        subject: Email subject
        plain_message: Plain text email content
        html_message: HTML email content
        **kwargs: Additional arguments to pass to send_mail
        
    Returns:
        bool: True if email was sent successfully
    """
    try:
        user = User.objects.get(id=user_id)
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
            **kwargs
        )
        logger.info(f"Async verification email sent to {user.email}")
        return True
    except User.DoesNotExist:
        logger.error(f"User with id {user_id} does not exist")
        return False
    except Exception as exc:
        logger.error(f"Failed to send async verification email to user {user_id}: {exc}")
        # Retry with exponential backoff
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))  # Exponential backoff

@shared_task(bind=True, max_retries=3, default_retry_delay=300)
def cleanup_expired_tokens(self):
    """
    Celery task to clean up expired email verification tokens.
    """
    try:
        logger.info("Starting cleanup of expired tokens")
        call_command('cleanup_tokens')
        logger.info("Successfully cleaned up expired tokens")
        return {"status": "success", "message": "Expired tokens cleaned up successfully"}
    except Exception as exc:
        logger.error(f"Error cleaning up expired tokens: {exc}")
        # Retry the task with exponential backoff
        raise self.retry(exc=exc, countdown=60 * 5)  # Retry after 5 minutes
