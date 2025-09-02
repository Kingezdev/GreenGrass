from django.db import models
from django.conf import settings
from accounts.models import UserProfile

class Property(models.Model):
    PROPERTY_TYPES = [
        ('apartment', 'Apartment'),
        ('house', 'House'),
        ('studio', 'Studio'),
        ('room', 'Room'),
        ('duplex', 'Duplex'),
    ]
    
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('rented', 'Rented'),
        ('maintenance', 'Under Maintenance'),
    ]
    
    landlord = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='room_properties')
    title = models.CharField(max_length=200)
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPES, default='apartment')
    location = models.CharField(max_length=300)
    address = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    bedrooms = models.PositiveIntegerField(default=1)
    bathrooms = models.PositiveIntegerField(default=1)
    area_sqft = models.PositiveIntegerField(help_text="Area in square feet")
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    
    # Amenities
    furnished = models.BooleanField(default=False)
    parking = models.BooleanField(default=False)
    pets_allowed = models.BooleanField(default=False)
    utilities_included = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.title} - {self.location} (${self.price})"

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='property_images/')
    caption = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-is_primary', 'uploaded_at']
        
    def __str__(self):
        return f"Image for {self.property.title}"

class PropertyReview(models.Model):
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]
    
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='reviews')
    tenant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='property_reviews')
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['property', 'tenant']  # One review per tenant per property
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.tenant.username} - {self.property.title} ({self.rating} stars)"

class LandlordReview(models.Model):
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]
    
    landlord = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='landlord_reviews')
    tenant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='given_landlord_reviews')
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['landlord', 'tenant']  # One review per tenant per landlord
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.tenant.username} reviewed {self.landlord.username} ({self.rating} stars)"

class Favorite(models.Model):
    tenant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['tenant', 'property']  # One favorite per tenant per property
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.tenant.username} favorited {self.property.title}"

class PropertyView(models.Model):
    """
    Track property views for analytics
    """
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='views')
    viewer = models.ForeignKey(settings.AUTH_USER_MODEL  , on_delete=models.CASCADE, null=True, blank=True)
    ip_address = models.GenericIPAddressField()
    viewed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-viewed_at']
        
    def __str__(self):
        viewer_name = self.viewer.username if self.viewer else "Anonymous"
        return f"{viewer_name} viewed {self.property.title}"
