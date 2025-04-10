from rest_framework import serializers
from .models import Rental, RentalPhoto


class RentalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rental
        fields = [
            "id",
            "renter",
            "owner",
            "product",
            "start_time",
            "end_time",
            "duration",
            "duration_unit",
            "total_cost",
            "service_fee",
            "security_deposit",
            "purpose",
            "notes",
            "pickup_method",
            "delivery_address",
            "delivery_time",
            "status",
            "status_history",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "renter",
            "owner",
            "product",
            "total_cost",
            "status_history",
            "created_at",
            "updated_at",
        ]

    def validate(self, data):
        """
        Validate rental data
        """
        # Validate duration and duration_unit
        if 'duration' in data and 'duration_unit' in data:
            if data['duration'] <= 0:
                raise serializers.ValidationError({
                    'duration': 'Duration must be greater than 0'
                })
            
            # Validate against product's max period
            if data['duration_unit']:
                product = self.instance.product if self.instance else None
                if product:
                    tier = product.pricing_tiers.filter(
                        duration_unit=data['duration_unit']
                    ).first()
                    if tier and tier.maxPeriod and data['duration'] > tier.maxPeriod:
                        raise serializers.ValidationError({
                            'duration': f'Maximum duration for {data["duration_unit"]} is {tier.maxPeriod}'
                        })

        # Validate start_time and end_time
        if 'start_time' in data and 'end_time' in data:
            if data['start_time'] >= data['end_time']:
                raise serializers.ValidationError({
                    'end_time': 'End time must be after start time'
                })

        # Validate delivery details if pickup_method is delivery
        if 'pickup_method' in data and data['pickup_method'] == 'delivery':
            if not data.get('delivery_address'):
                raise serializers.ValidationError({
                    'delivery_address': 'Delivery address is required for delivery pickup method'
                })
            if not data.get('delivery_time'):
                raise serializers.ValidationError({
                    'delivery_time': 'Delivery time is required for delivery pickup method'
                })

        return data


class RentalPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentalPhoto
        fields = ['id', 'photo', 'photo_type', 'created_at']
        read_only_fields = ['created_at']