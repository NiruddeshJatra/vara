from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, ProductImage
from .constants import STATUS_CHOICES, CATEGORY_CHOICES, PRODUCT_TYPE_CHOICES, DURATION_UNITS
from datetime import datetime
import json
from decimal import Decimal
from django.core.validators import FileExtensionValidator
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.files.images import get_image_dimensions
import os


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary']
        read_only_fields = ['id']

    def validate_image(self, value):
        """Validate image file type and size"""
        # Check file type
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in ['.jpg', '.jpeg', '.png']:
            raise serializers.ValidationError("Only JPG and PNG files are allowed.")
        
        # Check file size (5MB limit)
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File size cannot exceed 5MB.")
        
        # Check image dimensions
        try:
            width, height = get_image_dimensions(value)
            if width < 300 or height < 300:
                raise serializers.ValidationError("Image dimensions must be at least 300x300 pixels.")
        except Exception:
            raise serializers.ValidationError("Invalid image file.")
        
        return value


class ProductSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )
    unavailable_dates = serializers.ListField(
        child=serializers.DateField(),
        required=False,
        default=list
    )
    pricing_tiers = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        default=list
    )
    average_rating = serializers.DecimalField(
        max_digits=3,
        decimal_places=2,
        read_only=True
    )
    views_count = serializers.IntegerField(read_only=True)
    rental_count = serializers.IntegerField(read_only=True)
    status_message = serializers.CharField(read_only=True)
    status_changed_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'category', 'product_type', 'description', 'location',
            'images', 'uploaded_images', 'unavailable_dates', 'security_deposit',
            'condition', 'purchase_year', 'original_price', 'ownership_history',
            'pricing_tiers', 'status', 'status_message', 'status_changed_at',
            'created_at', 'updated_at', 'average_rating', 'views_count', 'rental_count'
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']

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
                raise serializers.ValidationError("Purchase year cannot be in the future.")
            if year < 1900:
                raise serializers.ValidationError("Purchase year seems invalid.")
            return str(year)  # Ensure it's stored as a string
        except (TypeError, ValueError):
            raise serializers.ValidationError("Purchase year must be a valid year.")

    def validate_unavailable_dates(self, value):
        """
        Validate the unavailable dates.
        
        Args:
            value: List of dates when the product is unavailable
            
        Returns:
            The validated dates
            
        Raises:
            ValidationError: If any date is invalid or in the past
        """
        if not isinstance(value, list):
            raise serializers.ValidationError("Unavailable dates must be a list")
            
        today = datetime.now().date()
        validated_dates = []
        
        for date_str in value:
            try:
                date = datetime.strptime(date_str, '%Y-%m-%d').date()
                if date < today:
                    raise serializers.ValidationError(f"Date {date_str} cannot be in the past")
                validated_dates.append(date.isoformat())
            except ValueError:
                raise serializers.ValidationError(f"Invalid date format: {date_str}")
                
        return validated_dates

    def validate_images(self, value):
        """
        Validate uploaded image file
        """
        if value:
            # Validate file type
            valid_extensions = ['.jpg', '.jpeg', '.png']
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in valid_extensions:
                raise serializers.ValidationError(f"Invalid file type. Allowed types: {', '.join(valid_extensions)}")
            
            # Validate file size (5MB)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("File size cannot exceed 5MB")
        
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

        # Validate pricing tiers if provided
        if 'pricing_tiers' in data:
            pricing_tiers = data['pricing_tiers']
            if not isinstance(pricing_tiers, list):
                raise serializers.ValidationError({
                    'pricing_tiers': 'Pricing tiers must be a list'
                })
            for tier in pricing_tiers:
                if not isinstance(tier, dict):
                    raise serializers.ValidationError({
                        'pricing_tiers': 'Each pricing tier must be an object'
                    })
                required_fields = ['duration_unit', 'max_period', 'price']
                for field in required_fields:
                    if field not in tier:
                        raise serializers.ValidationError({
                            'pricing_tiers': f'Each pricing tier must have a {field} field'
                        })
                # Validate duration_unit
                if tier['duration_unit'] not in dict(DURATION_UNITS):
                    raise serializers.ValidationError({
                        'pricing_tiers': f'Invalid duration unit. Must be one of {list(dict(DURATION_UNITS).keys())}'
                    })
                # Validate max_period
                try:
                    max_period = int(tier['max_period'])
                    if max_period <= 0:
                        raise serializers.ValidationError({
                            'pricing_tiers': 'Maximum rental period must be greater than 0'
                        })
                except (TypeError, ValueError):
                    raise serializers.ValidationError({
                        'pricing_tiers': 'Maximum rental period must be a valid integer'
                    })
                # Validate price
                try:
                    price = Decimal(str(tier['price']))
                    if price <= 0:
                        raise serializers.ValidationError({
                            'pricing_tiers': 'Price must be greater than 0'
                        })
                except (TypeError, ValueError):
                    raise serializers.ValidationError({
                        'pricing_tiers': 'Price must be a valid number'
                    })

        # Validate unavailable dates
        if 'unavailable_dates' in data:
            unavailable_dates = data['unavailable_dates']
            if not isinstance(unavailable_dates, list):
                raise serializers.ValidationError({
                    'unavailable_dates': 'Unavailable dates must be a list'
                })
            
            # Check for duplicate dates
            unique_dates = set(unavailable_dates)
            if len(unique_dates) != len(unavailable_dates):
                raise serializers.ValidationError({
                    'unavailable_dates': 'Duplicate dates are not allowed'
                })
            
            # Sort dates
            data['unavailable_dates'] = sorted(unavailable_dates)

        return data

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        product = super().create(validated_data)
        
        # Create ProductImage instances for uploaded images
        for image in uploaded_images:
            ProductImage.objects.create(
                product=product,
                image=image,
                is_primary=(len(product.images.all()) == 0)  # First image is primary
            )
        
        return product

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        product = super().update(instance, validated_data)
        
        # Handle new image uploads
        for image in uploaded_images:
            ProductImage.objects.create(
                product=product,
                image=image,
                is_primary=False  # New images are not primary by default
            )
        
        return product

    def to_representation(self, instance):
        """
        Convert the instance to a dictionary for serialization
        """
        ret = super().to_representation(instance)
        # Convert FileField to URL
        if instance.images:
            ret['images'] = instance.images.url
        return ret
