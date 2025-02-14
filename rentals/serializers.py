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
            "status",
            "total_price",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "renter",
            "owner",
            "product",
            "total_price",
            "created_at",
            "updated_at",
        ]


class RentalPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentalPhoto
        fields = ['id', 'photo', 'photo_type', 'created_at']
        read_only_fields = ['created_at']