# advertisements/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Product, PricingOption, AvailabilityPeriod

class PricingOptionSerializer(serializers.ModelSerializer):
    discounted_price = serializers.SerializerMethodField()
    
    class Meta:
        model = PricingOption
        exclude = ['product']
        
    def get_discounted_price(self, obj):
        duration = 1  # Default to one unit
        return obj.calculate_price(duration)

class AvailabilityPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailabilityPeriod
        exclude = ['product']
        
    def validate(self, data):
        """Validate date ranges and check for overlaps"""
        if data['end_date'] < data['start_date']:
            raise serializers.ValidationError("End date must be after start date")
            
        # Overlapping check will be handled by model's clean method
        return data

class ProductSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    pricing_details = PricingOptionSerializer(source='pricing', read_only=True)
    availability = AvailabilityPeriodSerializer(source='availability_periods', many=True, read_only=True)
    distance = serializers.SerializerMethodField()
    is_rentable = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'category', 'description', 'image', 'image_url',
            'security_deposit', 'location', 'latitude', 'longitude',
            'is_available', 'views_count', 'status', 'average_rating',
            'created_at', 'updated_at', 'user', 'user_name',
            'pricing_details', 'availability', 'distance', 'is_rentable'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'user', 'user_name',
            'views_count', 'average_rating', 'distance'
        ]

    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None
        
    def get_distance(self, obj):
        """Calculate distance from user's location if provided"""
        request = self.context.get('request')
        if request and request.query_params.get('lat') and request.query_params.get('lng'):
            from django.contrib.gis.geos import Point
            from django.contrib.gis.db.models.functions import Distance
            
            user_location = Point(
                float(request.query_params['lng']),
                float(request.query_params['lat'])
            )
            if obj.latitude and obj.longitude:
                product_location = Point(obj.longitude, obj.latitude)
                distance = user_location.distance(product_location) * 100  # Convert to kilometers
                return round(distance, 2)
        return None

    def validate(self, data):
        if data.get('latitude') and not data.get('longitude'):
            raise serializers.ValidationError("Both latitude and longitude must be provided")
        if data.get('longitude') and not data.get('latitude'):
            raise serializers.ValidationError("Both latitude and longitude must be provided")
        return data