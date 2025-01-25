from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Product, PricingOption, AvailabilityPeriod


class BaseProductSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
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
            "distance",
            "is_rentable",
            "base_price",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "user",
            "user_name",
            "views_count",
            "average_rating",
            "distance",
        ]


class PricingOptionSerializer(serializers.ModelSerializer):
    discounted_price = serializers.SerializerMethodField()

    class Meta:
        model = PricingOption
        exclude = ["product"]

    def get_discounted_price(self, obj):
        duration = 1
        return obj.calculate_price(duration)


class AvailabilityPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailabilityPeriod
        exclude = ["product"]

    def validate(self, data):
        """Validate date ranges and check for overlaps"""
        if data["end_date"] < data["start_date"]:
            raise serializers.ValidationError("End date must be after start date")

        return data