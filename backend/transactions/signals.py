import logging
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.conf import settings
from django.utils import timezone
from .models import Transaction
from core.pusher_service import PusherService
from core.notifications import send_notification

logger = logging.getLogger(__name__)

@receiver(pre_save, sender=Transaction)
def handle_transaction_status_change(sender, instance, **kwargs):
    """Handle changes to transaction status"""
    if instance.pk is None:
        return  # New instance being created
        
    try:
        old_instance = Transaction.objects.get(pk=instance.pk)
        
        # Check if status changed
        if old_instance.status != instance.status:
            logger.info(f"Transaction {instance.reference} status changed from {old_instance.status} to {instance.status}")
            
            # Handle successful payment
            if instance.status == 'successful':
                instance.completed_at = timezone.now()
                
                # TODO: Add any post-payment actions here
                # For example:
                # - Update room/property status
                # - Create lease agreement
                # - Send confirmation emails
                
                # Send real-time notification via Pusher
                try:
                    PusherService.trigger(
                        f'user_{instance.user.id}',
                        'payment_successful',
                        {
                            'transaction_id': str(instance.id),
                            'reference': instance.reference,
                            'amount': str(instance.amount),
                            'message': 'Your payment was successful!'
                        }
                    )
                except Exception as e:
                    logger.error(f"Error sending Pusher notification: {str(e)}")
                
                # Send email notification
                send_payment_confirmation_email(instance)
                
            # Handle failed payment
            elif instance.status == 'failed':
                try:
                    PusherService.trigger(
                        f'user_{instance.user.id}',
                        'payment_failed',
                        {
                            'transaction_id': str(instance.id),
                            'reference': instance.reference,
                            'amount': str(instance.amount),
                            'message': 'Your payment failed. Please try again.'
                        }
                    )
                except Exception as e:
                    logger.error(f"Error sending Pusher notification: {str(e)}")
                
    except Transaction.DoesNotExist:
        pass  # New instance


def send_payment_confirmation_email(transaction):
    """Send payment confirmation email to the user"""
    from django.template.loader import render_to_string
    from django.core.mail import EmailMultiAlternatives
    from django.utils.html import strip_tags
    
    try:
        subject = f"Payment Confirmation - {transaction.reference}"
        
        # Prepare email context
        context = {
            'user': transaction.user,
            'transaction': transaction,
            'property': transaction.property,
            'room': transaction.room,
            'amount': transaction.amount,
            'reference': transaction.reference,
            'date': transaction.completed_at or timezone.now(),
            'support_email': settings.DEFAULT_FROM_EMAIL,
        }
        
        # Render HTML email
        html_content = render_to_string('emails/payment_confirmation.html', context)
        text_content = strip_tags(html_content)  # Strip HTML for plain text version
        
        # Create email message
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[transaction.user.email],
            reply_to=[settings.DEFAULT_FROM_EMAIL],
        )
        email.attach_alternative(html_content, "text/html")
        
        # Send email
        email.send(fail_silently=False)
        logger.info(f"Payment confirmation email sent for transaction {transaction.reference}")
        
    except Exception as e:
        logger.error(f"Error sending payment confirmation email: {str(e)}", exc_info=True)
        raise
