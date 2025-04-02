from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Product, PricingOption, ProductImage

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    # BLACKBOX - use it whenever you need to provide the absolute URL for an image in a serialized response.
    # needed to provide the absolute URL for the product image in the serialized response.
    def get_image_url(self, obj):
        request = self.context.get(
            "request"
        )  # context is a dictionary that can be passed to the serializer to provide additional information. The context is automatically passed to the serializer when it is instantiated within a view. The context typically includes request object.
        if obj.image and request:
            return request.build_absolute_uri(
                obj.image.url
            )  # This method doesn't require any additional imports as it uses request object, which is part of the Django framework
        return None
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'created_at']


class PricingOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingOption
        fields = ['id', 'base_price', 'duration_unit', 'minimum_rental_period', 'maximum_rental_period']


class ProductSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    pricing = PricingOptionSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    unavailable_dates = serializers.ListField(
        child=serializers.DateField(),
        required=False,
        default=list
    )

    class Meta:
        model = Product
        fields = [
            'id', 'owner', 'title', 'category', 'description', 'location',
            'latitude', 'longitude', 'is_available', 'status', 'created_at',
            'updated_at', 'average_rating', 'unavailable_dates', 'pricing',
            'images'
        ]
        read_only_fields = ['owner', 'created_at', 'updated_at', 'average_rating']
