from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, ProductImage, UnavailableDate, PricingTier
from datetime import datetime
from django.core.files.images import get_image_dimensions
import os
from django.utils.translation import gettext_lazy as _
from django.db import transaction
import json
import logging

logger = logging.getLogger(__name__)


def validate_image_file(value):
    """Common image validation logic"""
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


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ["id", "image", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
        
    def validate_image(self, value):
        return validate_image_file(value)


class UnavailableDateSerializer(serializers.ModelSerializer):
    date = serializers.DateField(required=False, allow_null=True)
    range_start = serializers.DateField(required=False, allow_null=True)
    range_end = serializers.DateField(required=False, allow_null=True)

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

    def to_internal_value(self, data):
        # Convert string dates to date objects
        if isinstance(data, dict):
            if data.get("date"):
                try:
                    data["date"] = datetime.strptime(data["date"], "%Y-%m-%d").date()
                except (ValueError, TypeError):
                    raise serializers.ValidationError(
                        {"date": "Date has wrong format. Use YYYY-MM-DD."}
                    )
            if data.get("range_start"):
                try:
                    data["range_start"] = datetime.strptime(
                        data["range_start"], "%Y-%m-%d"
                    ).date()
                except (ValueError, TypeError):
                    raise serializers.ValidationError(
                        {"range_start": "Date has wrong format. Use YYYY-MM-DD."}
                    )
            if data.get("range_end"):
                try:
                    data["range_end"] = datetime.strptime(
                        data["range_end"], "%Y-%m-%d"
                    ).date()
                except (ValueError, TypeError):
                    raise serializers.ValidationError(
                        {"range_end": "Date has wrong format. Use YYYY-MM-DD."}
                    )
        return super().to_internal_value(data)


class PricingTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingTier
        fields = ["id", "duration_unit", "price", "max_period"]
        read_only_fields = ["id"]

    def validate(self, data):
        if data.get("price", 0) <= 0:
            raise serializers.ValidationError(_("Price must be greater than 0"))
        if data.get("max_period") is not None and data["max_period"] <= 0:
            raise serializers.ValidationError(_("Max period must be greater than 0"))
        return data


class ProductSerializer(serializers.ModelSerializer):
    # Read-only fields for related data
    product_images = ProductImageSerializer(many=True, read_only=True)
    average_rating = serializers.DecimalField(
        max_digits=3, decimal_places=2, read_only=True
    )
    views_count = serializers.IntegerField(read_only=True)
    rental_count = serializers.IntegerField(read_only=True)
    status_message = serializers.CharField(read_only=True)
    status_changed_at = serializers.DateTimeField(read_only=True)
    pricing_tiers = PricingTierSerializer(many=True, read_only=True)
    unavailable_dates = UnavailableDateSerializer(many=True, read_only=True)

    # Write-only fields for input data
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )
    unavailable_dates_input = serializers.CharField(write_only=True, required=False)
    pricing_tiers_input = serializers.CharField(write_only=True, required=False)

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
            "product_images",    # Read-only field for product images (mapped to proper relation)
            "images",            # Write-only field for uploading images
            "views_count",
            "rental_count",
            "average_rating",
            "created_at",
            "updated_at",
            "unavailable_dates",
            "pricing_tiers",
            "unavailable_dates_input",
            "pricing_tiers_input",
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
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # When updating, we need to know if this is an update request
        self.is_update = kwargs.get('instance') is not None

    def validate_images(self, value):
        """Validate list of images"""
        for image in value:
            validate_image_file(image)
        return value

    def validate_unavailable_dates(self, value):
        """Parse and validate unavailable dates JSON string"""
        if not value:
            return []
        try:
            dates = json.loads(value)
            serializer = UnavailableDateSerializer(data=dates, many=True)
            if not serializer.is_valid():
                raise serializers.ValidationError(serializer.errors)
            return serializer.validated_data
        except json.JSONDecodeError:
            raise serializers.ValidationError("Invalid JSON format for unavailable dates")

    def validate_pricing_tiers(self, value):
        """Parse and validate pricing tiers JSON string"""
        if not value:
            return []
        try:
            tiers = json.loads(value)
            serializer = PricingTierSerializer(data=tiers, many=True)
            if not serializer.is_valid():
                raise serializers.ValidationError(serializer.errors)
            return serializer.validated_data
        except json.JSONDecodeError:
            raise serializers.ValidationError("Invalid JSON format for pricing tiers")

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
            return str(year)
        except (TypeError, ValueError):
            raise serializers.ValidationError("Purchase year must be a valid year.")

    def validate_original_price(self, value):
        if value <= 0:
            raise serializers.ValidationError(_("Original price must be greater than 0"))
        return value

    @transaction.atomic
    def create(self, validated_data):
        try:
            logger.info(f"Create method called on ProductSerializer")
            # Extract related data
            images = validated_data.pop("images", [])
            unavailable_dates = validated_data.pop("unavailable_dates_input", [])
            pricing_tiers = validated_data.pop("pricing_tiers_input", [])
            
            # Remove owner from validated_data if it exists
            validated_data.pop("owner", None)

            # Create the product with the current user as owner
            product = Product.objects.create(
                owner=self.context["request"].user,
                **validated_data
            )

            # Create images
            for image in images:
                ProductImage.objects.create(product=product, image=image)

            # Create unavailable dates
            for date_data in unavailable_dates:
                UnavailableDate.objects.create(product=product, **date_data)

            # Create pricing tiers
            for tier_data in pricing_tiers:
                PricingTier.objects.create(product=product, **tier_data)

            return product
        except Exception as e:
            logger.error(f"Error creating product: {str(e)}")
            raise serializers.ValidationError(f"Error creating product: {str(e)}")
          
          
    @transaction.atomic
    def update(self, instance, validated_data):
        logger.info(f"Update method called for product {instance.id}")
        # Extract related data
        images = validated_data.pop("images", [])
        unavailable_dates = validated_data.pop("unavailable_dates_input", [])
        pricing_tiers = validated_data.pop("pricing_tiers_input", [])
        
        # Update the product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Handle images - add new ones if provided
        if images:
            # Create new images
            for image in images:
                ProductImage.objects.create(product=instance, image=image)
        
        # Handle unavailable dates - clear existing and create new ones
        if unavailable_dates:
            # Delete existing dates
            UnavailableDate.objects.filter(product=instance).delete()
            # Create new dates
            for date_data in unavailable_dates:
                UnavailableDate.objects.create(product=instance, **date_data)
        
        # Handle pricing tiers - clear existing and create new ones
        if pricing_tiers:
            # Delete existing tiers
            PricingTier.objects.filter(product=instance).delete()
            # Create new tiers
            for tier_data in pricing_tiers:
                PricingTier.objects.create(product=instance, **tier_data)
        
        return instance
