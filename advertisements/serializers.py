from rest_framework import serializers
from .models import Product
class ProductSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'title', 'category', 'description', 'price', 'image', 'image_url', 'location', 'is_available', 'created_at', 'updated_at', 'user', 'user_name']
        read_only_fields = ['id', 'created_at', 'updated_at', 'user', 'user_name']

    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero")
        return value
      
    def validate_image(self, value):
        if value:
            # Check file size (e.g., 5MB limit)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Image size should not exceed 5MB")
            
            # Check file extension
            valid_extensions = ['jpg', 'jpeg', 'png']
            ext = value.name.split('.')[-1].lower()
            if ext not in valid_extensions:
                raise serializers.ValidationError(
                    "Unsupported file extension. Use jpg, jpeg, or png"
                )
        return value