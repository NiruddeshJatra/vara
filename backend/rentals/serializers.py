from rest_framework import serializers
from .models import Rental, RentalPhoto
from django.utils.translation import gettext_lazy as _


class RentalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rental
        fields = [
            'id',
            'product',
            'start_time',
            'end_time',
            'duration',
            'duration_unit',
            'purpose',
            'notes',
            'status',
            'created_at',
            'updated_at',
            'total_cost',
            'service_fee'
        ]
        read_only_fields = [
            'id',
            'status',
            'created_at',
            'updated_at'
        ]

    def validate(self, data):
        """
        Validate rental data with detailed error messages
        """
        print(f"\n=== Rental Validation Start ===")
        print(f"Raw data received: {self.initial_data}")
        print(f"Transformed data: {data}")

        # Validate duration and duration_unit
        if 'duration' in data and 'duration_unit' in data:
            duration = data['duration']
            duration_unit = data['duration_unit']
            
            print(f"Validating duration: {duration} {duration_unit}")
            
            if duration <= 0:
                raise serializers.ValidationError({
                    'duration': _('Duration must be greater than 0')
                })
            
            if duration_unit not in ['day', 'week', 'month']:
                raise serializers.ValidationError({
                    'duration_unit': _('Invalid duration unit. Must be one of: day, week, month')
                })

            # Check if the duration matches the product's pricing tier
            product = data['product']
            if not product.pricing_tiers.filter(duration_unit=duration_unit).exists():
                raise serializers.ValidationError({
                    'duration_unit': _('This product cannot be rented by {}').format(duration_unit)
                })

            # Check if duration exceeds max period
            tier = product.pricing_tiers.filter(duration_unit=duration_unit).first()
            if tier and tier.max_period and duration > tier.max_period:
                raise serializers.ValidationError({
                    'duration': _('Maximum rental duration is {} {}s').format(
                        tier.max_period, duration_unit
                    )
                })

        # Validate start_time and end_time
        if 'start_time' in data and 'end_time' in data:
            print(f"Validating times - Start: {data['start_time']}, End: {data['end_time']}")
            
            if data['start_time'] >= data['end_time']:
                raise serializers.ValidationError({
                    'end_time': _('End time must be after start time')
                })

            from django.utils import timezone
            if data['start_time'] < timezone.now():
                raise serializers.ValidationError({
                    'start_time': _('Start time cannot be in the past')
                })

            # Check if the rental period overlaps with any unavailable dates
            product = data['product']
            for unavailable_date in product.unavailable_dates.all():
                if unavailable_date.is_range:
                    if (data['start_time'].date() <= unavailable_date.range_end and
                        data['end_time'].date() >= unavailable_date.range_start):
                        raise serializers.ValidationError({
                            'start_time': _('Selected dates overlap with unavailable period')
                        })
                else:
                    if (data['start_time'].date() <= unavailable_date.date and
                        data['end_time'].date() >= unavailable_date.date):
                        raise serializers.ValidationError({
                            'start_time': _('Selected dates include unavailable date')
                        })

        # Validate cost fields if provided
        if 'total_cost' in data and 'service_fee' in data:
            if data['total_cost'] <= 0:
                raise serializers.ValidationError({
                    'total_cost': _('Total cost must be greater than 0')
                })

            if data['service_fee'] < 0:
                raise serializers.ValidationError({
                    'service_fee': _('Service fee cannot be negative')
                })

        # Validate purpose and notes
        if 'purpose' in data:
            if len(data['purpose']) < 10:
                raise serializers.ValidationError({
                    'purpose': _('Please provide more detail about your rental purpose (minimum 10 characters)')
                })
            if len(data['purpose']) > 500:
                raise serializers.ValidationError({
                    'purpose': _('Purpose description is too long (maximum 500 characters)')
                })

        if 'notes' in data and data['notes']:
            if len(data['notes']) > 1000:
                raise serializers.ValidationError({
                    'notes': _('Notes are too long (maximum 1000 characters)')
                })

        print("\n=== Rental Validation Complete ===")
        return data


class RentalPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentalPhoto
        fields = ['id', 'photo', 'photo_type', 'created_at']
        read_only_fields = ['created_at']

    def validate_photo(self, value):
        """
        Validate the photo file
        """
        # Check file size
        if value.size > 5 * 1024 * 1024:  # 5MB
            raise serializers.ValidationError(_('Photo size cannot exceed 5MB'))

        # Check file type
        allowed_types = ['image/jpeg', 'image/png', 'image/jpg']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError(_('Only JPEG and PNG files are allowed'))

        return value