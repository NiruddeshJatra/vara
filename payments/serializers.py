from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    """
    Simplified Payment serializer for Bkash integration.
    """
    class Meta:
        model = Payment
        fields = [
            'id', 'amount', 'payment_method', 'status',
            'transaction_id', 'created_at', 'bkash_trx_id',
            'payer_mobile'
        ]
        read_only_fields = [
            'status', 'transaction_id', 'created_at',
            'bkash_trx_id', 'payer_mobile'
        ]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value