from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Product, PricingOption, AvailabilityPeriod


class PricingOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingOption
        fields = '__all__'


class AvailabilityPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailabilityPeriod
        exclude = ["product"]


class BaseProductSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    location_url = serializers.SerializerMethodField()

    def get_user_name(self, obj):
        return obj.owner.get_full_name() or obj.owner.username

    # BLACKBOX - use it whenever you need to provide the absolute URL for an image in a serialized response.
    # needed to provide the absolute URL for the product image in the serialized response. 
    def get_image_url(self, obj):
        request = self.context.get("request") # context is a dictionary that can be passed to the serializer to provide additional information. The context is automatically passed to the serializer when it is instantiated within a view. The context typically includes the request object.
        if (obj.image and request):
            return request.build_absolute_uri(obj.image.url) # This method does not require any additional imports because it uses the request object, which is part of the Django framework
        return None
        
    # BLACKBOX - use it whenever you need to provide the absolute URL for a location in a serialized response.
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

