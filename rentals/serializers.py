from rest_framework import serializers
from .models import Rentals


class RentalRequestSerializer(serializers.ModelSerializer):
    class Meta:
      model = Rentals
      fields = ['start_date', 'end_date', 'choices']
      read_only_fields = ['id', 'created_at', 'updated_at', 'renter', 'product']