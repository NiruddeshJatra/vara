from rest_framework import serializers
from django.utils.timezone import now
from .models import Rental, EscrowPayment


class RentalSerializer(serializers.ModelSerializer):
    """
    Serializer for Rental model.
    """
    duration = serializers.SerializerMethodField()
    escrow_status = serializers.SerializerMethodField()

    class Meta:
        model = Rental
        fields = [
            'id', 'renter', 'owner', 'product', 'start_time', 'end_time', 'status',
            'total_price', 'notes', 'created_at', 'updated_at', 'duration', 'escrow_status'
        ]
        read_only_fields = ['owner', 'total_price', 'created_at', 'updated_at', 'escrow_status']

    def get_duration(self, obj):
        """Calculate rental duration in days."""
        return (obj.end_time - obj.start_time).days

    def get_escrow_status(self, obj):
        """Get the status of the escrow payment."""
        return obj.escrow_payment.status if hasattr(obj, 'escrow_payment') else None
      
      
class EscrowPaymentSerializer(serializers.ModelSerializer):
    """
    Serializer for EscrowPayment model.
    """
    class Meta:
        model = EscrowPayment
        fields = ['id', 'status', 'held_amount', 'release_date', 'created_at']
        read_only_fields = ['id', 'status', 'held_amount', 'release_date', 'created_at']