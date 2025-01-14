from rest_framework import serializers
from .models import Complaint

class ComplaintSerializer(serializers.ModelSerializer):
    complainant_name = serializers.CharField(source='complainant.get_full_name', read_only=True)
    against_user_name = serializers.CharField(source='against_user.get_full_name', read_only=True)
    rental_details = serializers.CharField(source='rental_request.title', read_only=True)

    class Meta:
        model = Complaint
        fields = [
            'id',
            'complainant',
            'complainant_name',
            'against_user',
            'against_user_name',
            'rental_request',
            'rental_details',
            'description',
            'status',
            'admin_notes',
            'resolution_date',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'complainant',
            'complainant_name',
            'against_user',
            'against_user_name',
            'rental_details',
            'status',
            'resolution_date',
            'created_at',
            'updated_at',
        ]

    def validate(self, data):
        user = self.context['request'].user

        # Prevent filing a complaint against oneself
        if data.get('against_user') == user:
            raise serializers.ValidationError("You cannot file a complaint against yourself.")

        # Ensure the rental request is valid for the involved users
        rental = data.get('rental_request')
        if rental and (
            rental.owner != data.get('against_user') or rental.renter != user
        ):
            raise serializers.ValidationError("Invalid rental request for this complaint.")

        return data
