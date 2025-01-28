from rest_framework import serializers
from .models import Payment
from decimal import Decimal

class PaymentSerializer(serializers.ModelSerializer):
    """
    Serializer for Payment model.
    """
    class Meta:
        model = Payment
        fields = [
            'id', 'amount', 'payment_method',
            'status', 'transaction_id', 'created_at',
            'description', 'billing_address', 'session_key', 'ssl_status'
        ]
        read_only_fields = ['status', 'transaction_id', 'created_at', 'session_key', 'ssl_status']

    def validate_billing_address(self, value):
        if value and not isinstance(value, dict):
            raise serializers.ValidationError("Billing address must be a valid JSON object.")
        return value
