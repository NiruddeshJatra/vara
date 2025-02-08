# Serializers for advertisement models to convert model instances into JSON format and vice versa.

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Product, PricingOption, AvailabilityPeriod

# Base serializer for Product providing common fields and extra URL properties.
class BaseProductSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    location_url = serializers.SerializerMethodField()

    # Returns the full name or username of the product's user.
    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    # Build an absolute image URL if an image is available.
    def get_image_url(self, obj):
        request = self.context.get("request")
        if (obj.image and request):
            return request.build_absolute_uri(obj.image.url)
        return None
          
    # Returns a Google Maps URL based on the product's location.
    def get_location_url(self, obj):
        if obj.location:
            return f"https://www.google.com/maps/search/?api=1&query={obj.location}"
        return None

# Serializer for Product model including nested pricing and availability data.
class ProductSerializer(BaseProductSerializer):
    pricing_details = PricingOptionSerializer(source="pricing", read_only=True)
    availability = AvailabilityPeriodSerializer(
        source="availability_periods", many=True, read_only=True
    )
    is_rentable = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "category",
            "description",
            "image",
            "image_url",
            "security_deposit",
            "location",
            "location_url",
            "is_available",
            "views_count",
            "status",
            "average_rating",
            "created_at",
            "updated_at",
            "user",
            "user_name",
            "pricing_details",
            "availability",
            "is_rentable",
            "base_price",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "user",
            "user_name",
            "location",
            "location_url",
            "is_rentable",
            "views_count",
            "average_rating",
        ]

# Serializer for PricingOption model with a method to calculate discounted price.
class PricingOptionSerializer(serializers.ModelSerializer):
    discounted_price = serializers.SerializerMethodField()

    class Meta:
        model = PricingOption
        fields = [
            "id", "base_price", "duration_unit", 
            "minimum_rental_period", "maximum_rental_period", 
            "discount_percentage", "discounted_price"
        ]

    # Returns the calculated discounted price.
    def get_discounted_price(self, obj):
        return obj.calculate_price()

# Serializer for AvailabilityPeriod model.
class AvailabilityPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailabilityPeriod
        exclude = ["product"]