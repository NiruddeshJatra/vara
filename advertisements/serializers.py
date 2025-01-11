from rest_framework import serializers
from .models import Product, PricingOption, AvailabilityPeriod


class ProductSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'title', 'category', 'description', 'image', 'image_url', 'location', 'is_available', 'created_at', 'updated_at', 'user', 'user_name']
        read_only_fields = ['id', 'created_at', 'updated_at', 'user', 'user_name']

    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def validate_category(self, value):
        valid_categories = [choice[0] for choice in CATEGORY_CHOICES]
        if value not in valid_categories:
            raise serializers.ValidationError("Invalid category selected.")
        return value
      
    def validate_image(self, value):
        if value and value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Image size should not exceed 5MB")
        return value
      
      
class PricingOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingOption
        exclude = ['product']


class AvailabilityPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailabilityPeriod
        exclude = ['product']