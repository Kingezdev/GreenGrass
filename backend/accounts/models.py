from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    USER_TYPES = [
        ('landlord', 'Landlord'),
        ('tenant', 'Tenant'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
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
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.user_type}"
    
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
