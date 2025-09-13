from django.db import migrations

class Migration(migrations.Migration):
    """
    Enable the pg_trgm extension which provides text similarity functions.
    This is required for the user search functionality.
    """
    
    dependencies = [
        ('accounts', '0005_add_search_indexes'),
    ]

    operations = [
        migrations.RunSQL(
            'CREATE EXTENSION IF NOT EXISTS pg_trgm',
            'DROP EXTENSION IF EXISTS pg_trgm'
        ),
    ]
