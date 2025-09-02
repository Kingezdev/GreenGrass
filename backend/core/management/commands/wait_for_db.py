import time
from django.core.management.base import BaseCommand
from django.db import connections
from django.db.utils import OperationalError
import psycopg2
from psycopg2 import OperationalError as Psycopg2OpError

class Command(BaseCommand):
    """Django command to pause execution until database is available"""

    def handle(self, *args, **options):
        """Handle the command"""
        self.stdout.write('Waiting for database...')
        db_conn = None
        max_retries = 30
        retry_delay = 1  # seconds

        for attempt in range(max_retries):
            try:
                db_conn = connections['default']
                db_conn.ensure_connection()
                self.stdout.write(self.style.SUCCESS('✅ Database is available'))
                return
            except (Psycopg2OpError, OperationalError) as e:
                if attempt == max_retries - 1:
                    self.stdout.write(
                        self.style.ERROR(f'❌ Could not connect to database after {max_retries} attempts')
                    )
                    self.stdout.write(self.style.ERROR(f'Error: {e}'))
                    raise
                self.stdout.write(f'Database unavailable, waiting {retry_delay} second(s)... (attempt {attempt + 1}/{max_retries})')
                time.sleep(retry_delay)
