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
        fields = ['id', 'image', 'order', 'image_url']


class PricingTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingTier
        fields = ['id', 'duration_unit', 'price', 'max_period']


class ProductSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    owner = UserSerializer(read_only=True)
    pricing_tiers = PricingTierSerializer(many=True, required=False)
    average_rating = serializers.FloatField(read_only=True)
    views_count = serializers.IntegerField(read_only=True)
    rental_count = serializers.IntegerField(read_only=True)
    status_message = serializers.CharField(read_only=True)
    status_changed_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'category', 'product_type', 'description', 'location',
            'base_price', 'duration_unit', 'images', 'unavailable_dates',
            'security_deposit', 'condition', 'purchase_year', 'original_price',
            'ownership_history', 'pricing_tiers', 'owner', 'status',
            'status_message', 'status_changed_at', 'created_at', 'updated_at',
            'average_rating', 'views_count', 'rental_count'
        ]
        read_only_fields = ['owner', 'status', 'status_message', 'status_changed_at',
                          'created_at', 'updated_at', 'average_rating', 'views_count',
                          'rental_count']

    def get_images(self, obj):
        return [image.image.url for image in obj.product_images.all().order_by('order')]

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
            # Get valid product types for the selected category
            valid_types = [pt[0] for pt in PRODUCT_TYPE_CHOICES if pt[1] == category]
            if product_type not in valid_types:
                raise serializers.ValidationError({
                    'product_type': f'Product type must be one of {valid_types} for the selected category.'
                })

        return data

    def create(self, validated_data):
        pricing_tiers_data = validated_data.pop('pricing_tiers', [])
        product = Product.objects.create(**validated_data)
        
        for tier_data in pricing_tiers_data:
            PricingTier.objects.create(product=product, **tier_data)
            
        return product

    def update(self, instance, validated_data):
        pricing_tiers_data = validated_data.pop('pricing_tiers', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        if pricing_tiers_data is not None:
            instance.pricing_tiers.all().delete()
            for tier_data in pricing_tiers_data:
                PricingTier.objects.create(product=instance, **tier_data)
                
        instance.save()
        return instance
