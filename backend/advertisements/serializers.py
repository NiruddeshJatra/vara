from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, ProductImage, UnavailableDate, PricingTier
from django.db import transaction
from .validators import (
    validate_image_file,
    validate_purchase_year,
    validate_original_price,
    validate_unavailable_date,
    validate_pricing_tier,
)
from django.utils.translation import gettext_lazy as _
import json


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ["id", "image", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_image(self, obj):
        if obj.image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def validate_image(self, value):
        try:
            return validate_image_file(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError(
                _("Invalid image: {error}").format(error=str(e))
            )


class UnavailableDateSerializer(serializers.ModelSerializer):
    date = serializers.DateField(
        required=False, allow_null=True, format="%Y-%m-%d", input_formats=["%Y-%m-%d"]
    )
    range_start = serializers.DateField(
        required=False, allow_null=True, format="%Y-%m-%d", input_formats=["%Y-%m-%d"]
    )
    range_end = serializers.DateField(
        required=False, allow_null=True, format="%Y-%m-%d", input_formats=["%Y-%m-%d"]
    )
    is_range = serializers.BooleanField(default=False)

    class Meta:
        model = UnavailableDate
        fields = ["id", "date", "is_range", "range_start", "range_end"]
        read_only_fields = ["id"]

    def validate(self, data):
        return validate_unavailable_date(data)


class PricingTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingTier
        fields = ["id", "duration_unit", "price", "max_period"]
        read_only_fields = ["id"]

    def validate(self, data):
        return validate_pricing_tier(data)


class ProductSerializer(serializers.ModelSerializer):
    product_images = ProductImageSerializer(many=True, read_only=True)
    average_rating = serializers.DecimalField(
        max_digits=3, decimal_places=2, read_only=True
    )
    views_count = serializers.IntegerField(read_only=True)
    rental_count = serializers.IntegerField(read_only=True)
    status_message = serializers.CharField(read_only=True)
    status_changed_at = serializers.DateTimeField(read_only=True)

    # For file uploads
    images = serializers.ListField(
        child=serializers.FileField(max_length=None, allow_empty_file=False, use_url=False),
        required=False
    )
    
    # For reading data
    unavailable_dates = UnavailableDateSerializer(many=True, read_only=True)
    pricing_tiers = PricingTierSerializer(many=True, read_only=True)

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
            "product_images",
            "images",
            "views_count",
            "rental_count",
            "average_rating",
            "created_at",
            "updated_at",
            "unavailable_dates",
            "pricing_tiers",
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
            "product_images",
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.is_update = kwargs.get("instance") is not None
        # Store the original data for custom processing
        self._original_data = kwargs.get("data", {})

    def validate_images(self, value):
        for image in value:
            validate_image_file(image)
        return value

    def validate_purchase_year(self, value):
        try:
            return validate_purchase_year(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError(
                _("Invalid purchase year: {error}").format(error=str(e))
            )

    def validate_original_price(self, value):
        try:
            return validate_original_price(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError(
                _("Invalid original price: {error}").format(error=str(e))
            )

    @transaction.atomic
    def create(self, validated_data):
        # Extract nested data
        images = validated_data.pop("images", [])
        
        # Process JSON fields directly from request data
        unavailable_dates = []
        pricing_tiers = []
        
        # Get original data (request data)
        original_data = self.initial_data
        
        # Process unavailable dates
        if 'unavailable_dates' in original_data:
            try:
                unavailable_dates_str = original_data['unavailable_dates']
                if isinstance(unavailable_dates_str, list):
                    unavailable_dates_str = unavailable_dates_str[0]  # Handle QueryDict lists
                unavailable_dates = json.loads(unavailable_dates_str)
            except Exception as e:
                print(f"Error parsing unavailable dates: {str(e)}")
        
        # Process pricing tiers
        if 'pricing_tiers' in original_data:
            try:
                pricing_tiers_str = original_data['pricing_tiers']
                if isinstance(pricing_tiers_str, list):
                    pricing_tiers_str = pricing_tiers_str[0]  # Handle QueryDict lists
                pricing_tiers = json.loads(pricing_tiers_str)
            except Exception as e:
                print(f"Error parsing pricing tiers: {str(e)}")
        
        product = Product.objects.create(**validated_data)

        for image in images:
            ProductImage.objects.create(product=product, image=image)

        for date_data in unavailable_dates:
            UnavailableDate.objects.create(product=product, **date_data)

        for tier_data in pricing_tiers:
            PricingTier.objects.create(product=product, **tier_data)

        return product

    @transaction.atomic
    def update(self, instance, validated_data):
        print(f"Update method called for product {instance.id}")
        images = validated_data.pop("images", None)
        
        # Process JSON fields directly from request data
        unavailable_dates = None
        pricing_tiers = None
        
        # Get original data (request data)
        original_data = self.initial_data
        
        # Process unavailable dates
        if 'unavailable_dates' in original_data:
            try:
                unavailable_dates_str = original_data['unavailable_dates']
                if isinstance(unavailable_dates_str, list):
                    unavailable_dates_str = unavailable_dates_str[0]  # Handle QueryDict lists
                unavailable_dates = json.loads(unavailable_dates_str)
                print(f"Parsed {len(unavailable_dates)} unavailable dates")
            except Exception as e:
                print(f"Error parsing unavailable dates: {str(e)}")
        
        # Process pricing tiers
        if 'pricing_tiers' in original_data:
            try:
                pricing_tiers_str = original_data['pricing_tiers']
                if isinstance(pricing_tiers_str, list):
                    pricing_tiers_str = pricing_tiers_str[0]  # Handle QueryDict lists
                pricing_tiers = json.loads(pricing_tiers_str)
                print(f"Parsed {len(pricing_tiers)} pricing tiers")
            except Exception as e:
                print(f"Error parsing pricing tiers: {str(e)}")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if images:
            for image in images:
                ProductImage.objects.create(product=instance, image=image)

        if unavailable_dates is not None:
            UnavailableDate.objects.filter(product=instance).delete()
            for date_data in unavailable_dates:
                UnavailableDate.objects.create(product=instance, **date_data)

        if pricing_tiers is not None:
            PricingTier.objects.filter(product=instance).delete()
            for tier_data in pricing_tiers:
                PricingTier.objects.create(product=instance, **tier_data)

        return instance