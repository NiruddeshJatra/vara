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


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ["id", "image", "created_at"]
        read_only_fields = ["id", "created_at"]

    # helps generate appropriate URLs whether the serializer is being used in an API view or a web view
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

    # Unified fields that handle both read and write
    images = serializers.ListField(child=serializers.ImageField(), required=False)
    pricing_tiers = PricingTierSerializer(many=True, required=False)
    unavailable_dates = UnavailableDateSerializer(many=True, required=False)

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
        print("Create method called on ProductSerializer with data:", validated_data)
        images = validated_data.pop("images", [])
        unavailable_dates = validated_data.pop("unavailable_dates", [])
        pricing_tiers = validated_data.pop("pricing_tiers", [])
        validated_data.pop("owner", None)

        print("Creating product with basic data")
        product = Product.objects.create(
            owner=self.context["request"].user, **validated_data
        )
        print("Product created with ID:", product.id)

        print("Processing", len(images), "images")
        for image in images:
            ProductImage.objects.create(product=product, image=image)

        print("Processing", len(unavailable_dates), "unavailable dates")
        for date_data in unavailable_dates:
            try:
                date = UnavailableDate.objects.create(product=product, **date_data)
                print("Created unavailable date:", date)
            except Exception as e:
                print("Error creating unavailable date:", str(e))
                raise

        print("Processing", len(pricing_tiers), "pricing tiers")
        for tier_data in pricing_tiers:
            try:
                tier = PricingTier.objects.create(product=product, **tier_data)
                print("Created pricing tier:", tier)
            except Exception as e:
                print("Error creating pricing tier:", str(e))
                raise

        # Verify the related objects were created
        print(
            "Final counts - Images:", product.product_images.count(),
            ", Dates:", product.unavailable_dates.count(),
            ", Tiers:", product.pricing_tiers.count(),
        )

        return product

    @transaction.atomic
    def update(self, instance, validated_data):
        print(f"Update method called for product {instance.id}")
        images = validated_data.pop("images", None)
        unavailable_dates = validated_data.pop("unavailable_dates", None)
        pricing_tiers = validated_data.pop("pricing_tiers", None)

        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Handle images if provided
        if images:
            for image in images:
                ProductImage.objects.create(product=instance, image=image)

        # Handle unavailable dates if provided
        if unavailable_dates is not None:
            # Validate all dates before deleting existing ones
            for date_data in unavailable_dates:
                validate_unavailable_date(date_data)

            UnavailableDate.objects.filter(product=instance).delete()
            for date_data in unavailable_dates:
                UnavailableDate.objects.create(product=instance, **date_data)

        # Handle pricing tiers if provided
        if pricing_tiers is not None:
            # Validate all tiers before deleting existing ones
            for tier_data in pricing_tiers:
                validate_pricing_tier(tier_data)

            PricingTier.objects.filter(product=instance).delete()
            for tier_data in pricing_tiers:
                PricingTier.objects.create(product=instance, **tier_data)

        return instance
