import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Custom user model that uses email as the unique identifier."""
    username = None
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=150, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    objects = UserManager()
    
    def __str__(self):
        return self.email

class EmailVerificationToken(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='email_verification_tokens')
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']  # Newest tokens first

    def is_valid(self):
        # Token is valid for 24 hours
        expiration_time = self.created_at + timezone.timedelta(hours=24)
        return not self.is_used and timezone.now() <= expiration_time

    def mark_used(self):
        """Mark this token as used."""
        self.is_used = True
        self.save(update_fields=['is_used'])

    def __str__(self):
        return f"{self.user.email} - {'Used' if self.is_used else 'Valid'}"

class UserProfile(models.Model):
    USER_TYPES = [
        ('landlord', 'Landlord'),
        ('tenant', 'Tenant'),
    ]
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    user_type = models.CharField(max_length=10, choices=USER_TYPES)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    
    # Profile fields
    bio = models.TextField(max_length=500, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    location = models.CharField(max_length=100, blank=True)
    
    # Landlord-specific fields
    company_name = models.CharField(max_length=100, blank=True)
    years_experience = models.PositiveIntegerField(null=True, blank=True)
    
    # Analytics fields
    total_property_views = models.PositiveIntegerField(default=0)
    total_inquiries_received = models.PositiveIntegerField(default=0)
    
    # Social/Contact fields
    website = models.URLField(blank=True)
    
    email_verified = models.BooleanField(default=False)
    email_verification_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.user_type}"
    
    def get_average_rating(self):
        """Get average rating for landlords"""
        if self.user_type == 'landlord':
            from rooms.models import LandlordReview
            reviews = LandlordReview.objects.filter(landlord=self.user)
            if reviews.exists():
                return reviews.aggregate(models.Avg('rating'))['rating__avg']
        return None
    
    def get_total_properties(self):
        """Get total number of properties for landlords"""
        if self.user_type == 'landlord':
            return self.user.room_properties.count()
        return 0
