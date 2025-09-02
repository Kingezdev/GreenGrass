from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import EmailVerificationToken
from django.db import transaction
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Cleans up expired email verification tokens'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be deleted without actually deleting',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        now = timezone.now()
        
        # Get all expired tokens
        expired_tokens = EmailVerificationToken.objects.filter(
            expires_at__lt=now
        )
        
        count = expired_tokens.count()
        
        if dry_run:
            self.stdout.write(
                self.style.WARNING(
                    f'[DRY RUN] Would delete {count} expired tokens'
                )
            )
            return
        
        # Delete expired tokens in a transaction
        with transaction.atomic():
            deleted_count, _ = expired_tokens.delete()
        
        if deleted_count > 0:
            logger.info(f'Deleted {deleted_count} expired tokens')
            self.stdout.write(
                self.style.SUCCESS(f'Successfully deleted {deleted_count} expired tokens')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS('No expired tokens to delete')
            )
