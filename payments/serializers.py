from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'amount', 'currency', 'payment_method', 
            'status', 'transaction_id', 'created_at', 
            'description', 'billing_address'
        ]
        read_only_fields = ['status', 'transaction_id', 'created_at']

    def validate_amount(self, value):
        if value <= Decimal('0'):
            raise serializers.ValidationError("Amount must be greater than zero")
        return value