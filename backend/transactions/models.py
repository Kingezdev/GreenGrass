from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator
from decimal import Decimal
import uuid

TRANSACTION_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('successful', 'Successful'),
    ('failed', 'Failed'),
    ('abandoned', 'Abandoned'),
]

PAYMENT_METHOD_CHOICES = [
    ('paystack', 'Paystack'),
    ('bank_transfer', 'Bank Transfer'),
    ('cash', 'Cash'),
]

class Transaction(models.Model):
    """Model to track rental payments and other financial transactions."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transactions')
    reference = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    currency = models.CharField(max_length=3, default='NGN')
    status = models.CharField(
        max_length=20, 
        choices=TRANSACTION_STATUS_CHOICES, 
        default='pending'
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        default='paystack'
    )
    metadata = models.JSONField(default=dict, blank=True)
    paystack_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    # For tracking what the payment is for
    property = models.ForeignKey(
        'rooms.Property', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='transactions'
    )
    room = models.ForeignKey(
        'rooms.Room', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='transactions',
        help_text='The specific room this transaction is for, if applicable'
    )
    # TODO: Create a Lease model in the core app and uncomment this
    # lease = models.ForeignKey(
    #     'core.Lease', 
    #     on_delete=models.SET_NULL, 
    #     null=True, 
    #     blank=True,
    #     related_name='transactions',
    #     help_text='The lease agreement this transaction is associated with'
    # )

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['reference']),
            models.Index(fields=['status']),
            models.Index(fields=['user']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.reference} - {self.get_status_display()} - {self.amount} {self.currency}"

    def mark_as_successful(self, paystack_data=None):
        """Mark transaction as successful and update relevant fields."""
        self.status = 'successful'
        self.completed_at = timezone.now()
        if paystack_data:
            self.paystack_data = paystack_data
        self.save()
        # TODO: Add signals or hooks for successful payment

    def mark_as_failed(self, paystack_data=None):
        """Mark transaction as failed."""
        self.status = 'failed'
        self.completed_at = timezone.now()
        if paystack_data:
            self.paystack_data = paystack_data
        self.save()
