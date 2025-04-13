from rest_framework import serializers
from .models import Rental, RentalPhoto, RENTAL_PURPOSE_CHOICES
from .validators import validate_rental_data, validate_rental_photo


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
        return validate_rental_data(data)


class RentalPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentalPhoto
        fields = ['id', 'photo', 'photo_type', 'created_at']
        read_only_fields = ['created_at']

    def validate_photo(self, value):
        return validate_rental_photo(value)