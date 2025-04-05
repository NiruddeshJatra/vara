from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, ProductImage, UnavailableDate, PricingTier
from .constants import CATEGORY_CHOICES, PRODUCT_TYPE_CHOICES
from datetime import datetime
from django.core.files.images import get_image_dimensions
import os
from django.utils.translation import gettext_lazy as _
from django.db import transaction
import json


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_image(self, value):
        """Validate image file type and size"""
        # Check file type
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in [".jpg", ".jpeg", ".png"]:
            raise serializers.ValidationError("Only JPG and PNG files are allowed.")

        # Check file size (5MB limit)
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File size cannot exceed 5MB.")

        # Check image dimensions
        try:
            width, height = get_image_dimensions(value)
            if width < 300 or height < 300:
                raise serializers.ValidationError(
                    "Image dimensions must be at least 300x300 pixels."
                )
        except Exception:
            raise serializers.ValidationError("Invalid image file.")

        return value


class UnavailableDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnavailableDate
        fields = ["id", "date", "is_range", "range_start", "range_end"]
        read_only_fields = ["id"]

    def validate(self, data):
        if data.get("is_range"):
            if not data.get("range_start") or not data.get("range_end"):
                raise serializers.ValidationError(
                    _("Range start and end dates are required for date ranges")
                )
            if data["range_end"] < data["range_start"]:
                raise serializers.ValidationError(
                    _("End date must be after start date")
                )
        elif not data.get("date"):
            raise serializers.ValidationError(_("Date is required for single dates"))
        return data


class PricingTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingTier
        fields = ["id", "duration_unit", "price", "max_period"]
        read_only_fields = ["id"]


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    unavailable_dates = UnavailableDateSerializer(many=True, required=False)
    pricing_tiers = PricingTierSerializer(many=True, required=False)
    average_rating = serializers.DecimalField(
        max_digits=3, decimal_places=2, read_only=True
    )
    views_count = serializers.IntegerField(read_only=True)
    rental_count = serializers.IntegerField(read_only=True)
    status_message = serializers.CharField(read_only=True)
    status_changed_at = serializers.DateTimeField(read_only=True)
    
    # File fields for direct upload handling
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "owner",
            "title",
            "category",
            "product_type",
            "description",
            "location",
            "security_deposit",
            "purchase_year",
            "original_price",
            "ownership_history",
            "status",
            "status_message",
            "status_changed_at",
            "images",
            "unavailable_dates",
            "pricing_tiers",
            "uploaded_images",
            "views_count",
            "rental_count",
            "average_rating",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "owner",
            "status",
            "status_message",
            "status_changed_at",
            "views_count",
            "rental_count",
            "average_rating",
            "created_at",
            "updated_at",
        ]

    def validate(self, data):
        """
        Validate the product data
        """
        request = self.context.get('request')
        
        # Validate image count from both sources
        image_count = 0
        if request and request.FILES:
            image_count += len(request.FILES.getlist('images', []))
        
        if 'uploaded_images' in data:
            image_count += len(data['uploaded_images'])
            
        if image_count > 10:
            raise serializers.ValidationError({"images": "Maximum 10 images allowed per product"})
                
        return data

    def validate_category(self, value):
        if value not in dict(CATEGORY_CHOICES):
            raise serializers.ValidationError("Invalid category selected.")
        return value

    def validate_product_type(self, value):
        if value not in dict(PRODUCT_TYPE_CHOICES):
            raise serializers.ValidationError("Invalid product type selected.")
        return value

    def validate_purchase_year(self, value):
        if not value:
            raise serializers.ValidationError("Purchase year is required.")

        try:
            year = int(value)
            current_year = datetime.now().year
            if year > current_year:
                raise serializers.ValidationError(
                    "Purchase year cannot be in the future."
                )
            if year < 1900:
                raise serializers.ValidationError("Purchase year seems invalid.")
            return str(year)  # Ensure it's stored as a string
        except (TypeError, ValueError):
            raise serializers.ValidationError("Purchase year must be a valid year.")

    def validate_original_price(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                _("Original price must be greater than 0")
            )
        return value
    
    def _parse_json_field(self, data, field_name):
        """Helper method to safely parse JSON fields"""
        if field_name in data:
            if isinstance(data[field_name], str):
                try:
                    return json.loads(data[field_name])
                except json.JSONDecodeError:
                    raise serializers.ValidationError({field_name: "Invalid JSON format"})
            return data[field_name]
        return []

    def to_internal_value(self, data):
        """
        Parse JSON strings in the incoming data
        """
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        
        # Handle pricing_tiers parsing
        if 'pricing_tiers' in data:
            data['pricing_tiers'] = self._parse_json_field(data, 'pricing_tiers')
        
        # Handle unavailable_dates parsing
        if 'unavailable_dates' in data:
            data['unavailable_dates'] = self._parse_json_field(data, 'unavailable_dates')
            
        # Pass the modified data to the parent method
        return super().to_internal_value(data)

    @transaction.atomic
    def create(self, validated_data):
        # Extract nested data
        uploaded_images = validated_data.pop('uploaded_images', [])
        unavailable_dates_data = validated_data.pop('unavailable_dates', [])
        pricing_tiers_data = validated_data.pop('pricing_tiers', [])
        
        # Set owner from the request
        validated_data['owner'] = self.context['request'].user
        
        # Create the product
        product = Product.objects.create(**validated_data)
        
        # Process images from request.FILES
        request = self.context.get('request')
        if request:
            for image in request.FILES.getlist('images', []):
                ProductImage.objects.create(product=product, image=image)
                
        # Handle uploaded_images from the serializer field
        # IMPORTANT: Process each image individually instead of storing the whole list
        for image in uploaded_images:
            ProductImage.objects.create(product=product, image=image)

        # Create unavailable dates
        for date_data in unavailable_dates_data:
            UnavailableDate.objects.create(product=product, **date_data)

        # Create pricing tiers
        for tier_data in pricing_tiers_data:
            PricingTier.objects.create(product=product, **tier_data)

        return product
        
    @transaction.atomic
    def update(self, instance, validated_data):
        # Extract nested data
        uploaded_images = validated_data.pop('uploaded_images', [])
        unavailable_dates_data = validated_data.pop('unavailable_dates', [])
        pricing_tiers_data = validated_data.pop('pricing_tiers', [])
        
        # Update the main product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Process new images
        request = self.context.get('request')
        if request:
            for image in request.FILES.getlist('images', []):
                ProductImage.objects.create(product=instance, image=image)
                
        # Process each image individually
        for image in uploaded_images:
            ProductImage.objects.create(product=instance, image=image)
            
        # Handle updates for related models (optional - this is a replace strategy)
        # For a more sophisticated approach, you might want to implement a diff
        # to only update what changed
        
        # Update unavailable dates - clear and recreate
        if unavailable_dates_data:
            instance.unavailable_dates.all().delete()
            for date_data in unavailable_dates_data:
                UnavailableDate.objects.create(product=instance, **date_data)
                
        # Update pricing tiers - clear and recreate
        if pricing_tiers_data:
            instance.pricing_tiers.all().delete()
            for tier_data in pricing_tiers_data:
                PricingTier.objects.create(product=instance, **tier_data)
                
        return instance