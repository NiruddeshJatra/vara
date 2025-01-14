from rest_framework import serializers
from django.utils.timezone import now
from .models import Rental


class RentalSerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()

    class Meta:
        model = Rental
        fields = [
            'id', 'renter', 'owner', 'product', 'start_time', 'end_time', 'status',
            'total_price', 'security_deposit', 'notes', 'created_at', 'updated_at', 'duration'
        ]
        read_only_fields = ['owner', 'total_price', 'security_deposit', 'created_at', 'updated_at']

    def get_duration(self, obj):
        """Calculate rental duration in days."""
        return (obj.end_time - obj.start_time).days

    def validate(self, attrs):
        """Ensure rental dates do not overlap with existing rentals."""
        start_time = attrs.get('start_time')
        end_time = attrs.get('end_time')
        product = attrs.get('product')

        if start_time >= end_time:
            raise serializers.ValidationError("End time must be after start time.")

        if start_time < now():
            raise serializers.ValidationError("Start time cannot be in the past.")

        overlapping_rentals = Rental.objects.filter(
            product=product,
            start_time__lt=end_time,
            end_time__gt=start_time,
            status__in=['accepted', 'in_progress']
        )
        if overlapping_rentals.exists():
            raise serializers.ValidationError("The selected product is already rented for the given time period.")

        return attrs