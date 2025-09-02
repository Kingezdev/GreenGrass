from django.db import models
from django.conf import settings
from rooms.models import Property

class Conversation(models.Model):
    """
    Represents a conversation between a landlord and tenant
    """
    landlord = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='landlord_conversations')
    tenant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tenant_conversations')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='conversations', null=True, blank=True)
    subject = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['landlord', 'tenant', 'property']
        ordering = ['-updated_at']
        
    def __str__(self):
        property_info = f" about {self.property.title}" if self.property else ""
        return f"Conversation between {self.landlord.username} and {self.tenant.username}{property_info}"

class Message(models.Model):
    """
    Individual messages within a conversation
    """
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
        
    def __str__(self):
        return f"Message from {self.sender.username} at {self.created_at}"
