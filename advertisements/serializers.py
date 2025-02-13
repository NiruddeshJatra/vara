from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Product, PricingOption, AvailabilityPeriod


class PricingOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingOption
        fields = [
            "id", "base_price", "duration_unit", 
            "minimum_rental_period", "maximum_rental_period", 
        ]


class AvailabilityPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailabilityPeriod
        exclude = ["product"]


class BaseProductSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    location_url = serializers.SerializerMethodField()

    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    def get_image_url(self, obj):
        request = self.context.get("request")
        if (obj.image and request):
            return request.build_absolute_uri(obj.image.url)
        return None
          
    def get_location_url(self, obj):
        if obj.location:
            return f"https://www.google.com/maps/search/?api=1&query={obj.location}"
        return None


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

