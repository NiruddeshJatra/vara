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
            'updated_at',
            'total_cost',
            'service_fee'
        ]

    def validate(self, data):
        """
        Validate rental data
        """
        print(f"\nValidating rental data: {data}")

        # Validate duration and duration_unit
        if 'duration' in data and 'duration_unit' in data:
            duration = data['duration']
            duration_unit = data['duration_unit']
            
            if duration <= 0:
                print("\nError: Duration must be greater than 0")
                raise serializers.ValidationError({
                    'duration': _('Duration must be greater than 0')
                })
            
            if duration_unit not in ['day', 'week', 'month']:
                print("\nError: Invalid duration unit. Must be one of: day, week, month")
                raise serializers.ValidationError({
                    'duration_unit': _('Invalid duration unit. Must be one of: day, week, month')
                })

        # Validate start_time and end_time
        if 'start_time' in data and 'end_time' in data:
            if data['start_time'] >= data['end_time']:
                raise serializers.ValidationError({
                    'end_time': _('End time must be after start time')
                })

            from django.utils import timezone
            if data['start_time'] < timezone.now():
                raise serializers.ValidationError({
                    'start_time': _('Start time cannot be in the past')
                })

        print("\nRental data validation passed")
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
            raise serializers.ValidationError(_("Photo size cannot exceed 5MB"))

        # Check file type
        allowed_types = ['image/jpeg', 'image/png', 'image/jpg']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError(_("Only JPEG and PNG files are allowed"))

        return value