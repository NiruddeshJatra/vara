from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, ProductImage, PricingTier
from .constants import STATUS_CHOICES, CATEGORY_CHOICES, PRODUCT_TYPE_CHOICES
from datetime import datetime


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
        fields = ['id', 'image', 'is_primary']


class PricingTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingTier
        fields = ['id', 'duration_unit', 'price', 'max_period']


class ProductSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    pricing_tiers = PricingTierSerializer(many=True, read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    views_count = serializers.IntegerField(read_only=True)
    rental_count = serializers.IntegerField(read_only=True)
    status_message = serializers.CharField(read_only=True)
    status_changed_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'owner', 'title', 'description', 'category', 'product_type',
            'base_price', 'duration_unit', 'security_deposit', 'condition',
            'item_age', 'purchase_year', 'original_price', 'ownership_history',
            'images', 'pricing_tiers', 'status', 'status_message', 'status_changed_at',
            'average_rating', 'views_count', 'rental_count', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'owner', 'average_rating', 'views_count', 'rental_count',
            'status_message', 'status_changed_at'
        ]

    def validate_category(self, value):
        if value not in dict(CATEGORY_CHOICES):
            raise serializers.ValidationError("Invalid category selected.")
        return value

    def validate_product_type(self, value):
        if value not in dict(PRODUCT_TYPE_CHOICES):
            raise serializers.ValidationError("Invalid product type selected.")
        return value

    def validate_purchase_year(self, value):
        current_year = datetime.now().year
        if value > current_year:
            raise serializers.ValidationError("Purchase year cannot be in the future.")
        if value < 1900:
            raise serializers.ValidationError("Purchase year seems invalid.")
        return value

    def validate(self, data):
        # Ensure product_type corresponds to the selected category
        category = data.get('category')
        product_type = data.get('product_type')
        
        if category and product_type:
            valid_types = [pt[0] for pt in PRODUCT_TYPE_CHOICES if pt[1] == category]
            if product_type not in valid_types:
                raise serializers.ValidationError({
                    'product_type': f'Product type must be one of {valid_types} for the selected category.'
                })

    def validate(self, data):
        # Validate that product_type belongs to the selected category
        category_product_types = {
            category: [pt for pt, cat in PRODUCT_TYPE_CHOICES if cat == category]
            for category, _ in CATEGORY_CHOICES
        }
        if data.get('category') and data.get('product_type'):
            if data['product_type'] not in category_product_types.get(data['category'], []):
                raise serializers.ValidationError(
                    f"Product type {data['product_type']} is not valid for category {data['category']}"
                )

        return data

    def create(self, validated_data):
        # Set initial status to draft for new listings
        validated_data['status'] = 'draft'
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Only allow status updates through the update_status method
        if 'status' in validated_data:
            status = validated_data.pop('status')
            instance.update_status(status)
        return super().update(instance, validated_data)
