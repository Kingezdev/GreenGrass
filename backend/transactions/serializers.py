from rest_framework import serializers
from .models import Transaction
from rooms.serializers import PropertySerializer, RoomSerializer

class TransactionSerializer(serializers.ModelSerializer):
    """Serializer for the Transaction model"""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    
    property_data = PropertySerializer(source='property', read_only=True)
    room_data = RoomSerializer(source='room', read_only=True)
    
    class Meta:
        model = Transaction
        fields = [
            'id',
            'reference',
            'amount',
            'currency',
            'status',
            'status_display',
            'payment_method',
            'payment_method_display',
            'metadata',
            'created_at',
            'updated_at',
            'completed_at',
            'property', 'property_data',
            'room', 'room_data',
            # 'lease',  # Uncomment when Lease model is created
        ]
        read_only_fields = [
            'id',
            'reference',
            'status',
            'created_at',
            'updated_at',
            'completed_at',
            'paystack_data',
            'property_data',
            'room_data',
        ]
        extra_kwargs = {
            'property': {'write_only': True, 'required': False},
            'room': {'write_only': True, 'required': False},
        }


class InitializePaymentSerializer(serializers.Serializer):
    """Serializer for initializing a payment"""
    amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        min_value=0.01,
        required=True
    )
    email = serializers.EmailField(required=False)
    property_id = serializers.UUIDField(required=False, allow_null=True)
    room_id = serializers.UUIDField(required=False, allow_null=True)
    # lease_id = serializers.UUIDField(required=False, allow_null=True)  # Uncomment when Lease model is created
    callback_url = serializers.URLField(required=False, allow_blank=True)

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero")
        return value
