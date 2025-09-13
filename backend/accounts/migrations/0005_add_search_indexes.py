from django.db import migrations, models


class Migration(migrations.Migration):
    """
    Add database indexes to improve search performance on User model.
    """
    
    dependencies = [
        ('accounts', '0004_remove_userprofile_company_name_and_more'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='user',
            index=models.Index(fields=['first_name'], name='accounts_us_first_n_8f83ff_idx'),
        ),
        migrations.AddIndex(
            model_name='user',
            index=models.Index(fields=['last_name'], name='accounts_us_last_na_2d3d8e_idx'),
        ),
        migrations.AddIndex(
            model_name='user',
            index=models.Index(fields=['email'], name='accounts_us_email_3c6f6d_idx'),
        ),
        migrations.AddIndex(
            model_name='user',
            index=models.Index(fields=['first_name', 'last_name'], name='accounts_us_first_n_0a8d8e_idx'),
        ),
    ]
