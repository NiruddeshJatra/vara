from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, ProductImage, UnavailableDate, PricingTier
from .constants import CATEGORY_CHOICES, PRODUCT_TYPE_CHOICES
from datetime import datetime
from django.core.files.images import get_image_dimensions
import os
from django.utils.translation import gettext_lazy as _


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

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError(_("Price must be greater than 0"))
        return value


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    unavailable_dates = UnavailableDateSerializer(many=True, required=False)
    pricing_tiers = PricingTierSerializer(many=True)
    average_rating = serializers.DecimalField(
        max_digits=3, decimal_places=2, read_only=True
    )
    views_count = serializers.IntegerField(read_only=True)
    rental_count = serializers.IntegerField(read_only=True)
    status_message = serializers.CharField(read_only=True)
    status_changed_at = serializers.DateTimeField(read_only=True)

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
        # Validate image count
        if "images" in self.context.get("request").FILES:
            if len(self.context.get("request").FILES.getlist("images")) > 10:
                raise serializers.ValidationError(
                    "Maximum 10 images allowed per product"
                )

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
