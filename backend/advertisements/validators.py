from rest_framework import serializers
from django.core.files.images import get_image_dimensions
from datetime import datetime
import os
from django.utils.translation import gettext_lazy as _
import json

def validate_image_file(value):
    """Common image validation logic"""
    # Check file type
    ext = os.path.splitext(value.name)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png"]:
        raise serializers.ValidationError(_("Only JPG and PNG files are allowed."))

    # Check file size (5MB limit)
    if value.size > 5 * 1024 * 1024:
        raise serializers.ValidationError(_("File size cannot exceed 5MB."))

    # Check image dimensions
    try:
        width, height = get_image_dimensions(value)
        if width < 300 or height < 300:
            raise serializers.ValidationError(
                _("Image dimensions must be at least 300x300 pixels.")
            )
    except Exception:
        raise serializers.ValidationError(_("Invalid image file."))

    return value

def validate_purchase_year(value):
    """Validate purchase year"""
    if not value:
        raise serializers.ValidationError(_("Purchase year is required."))

    try:
        year = int(value)
        current_year = datetime.now().year
        if year > current_year:
            raise serializers.ValidationError(
                _("Purchase year cannot be in the future.")
            )
        if year < 1900:
            raise serializers.ValidationError(_("Purchase year seems invalid."))
        return str(year)
    except (TypeError, ValueError):
        raise serializers.ValidationError(_("Purchase year must be a valid year."))

def validate_original_price(value):
    """Validate original price"""
    if value <= 0:
        raise serializers.ValidationError(
            _("Original price must be greater than 0")
        )
    return value

def validate_pricing_tier(data):
    """
    Unified validator that handles both single tier validation and array of tiers (JSON string or structured data).
    
    Args:
        data: Can be:
            - A string (JSON array of pricing tiers)
            - A dict (single tier data)
            - A list (array of tier data)
    
    Returns:
        Validated and processed pricing tier data
    """
    if isinstance(data, str):
        try:
            tiers = json.loads(data)
            if not isinstance(tiers, list):
                raise ValidationError(_("Expected a JSON array of pricing tiers"))
            return [validate_pricing_tier(tier) for tier in tiers]
        except json.JSONDecodeError:
            raise ValidationError(_("Invalid JSON format for pricing tiers"))
            
    if isinstance(data, list):
        return [validate_pricing_tier(tier) for tier in data]
        
    # Single tier validation
    if data.get("price", 0) <= 0:
        raise ValidationError(_("Price must be greater than 0"))
    if data.get("max_period") is not None and data["max_period"] <= 0:
        raise ValidationError(_("Max period must be greater than 0"))
    
    # Validate duration unit
    if "duration_unit" not in data:
        raise ValidationError(_("Duration unit is required"))
    if data["duration_unit"] not in ["day", "week", "month"]:
        raise ValidationError(_("Invalid duration unit. Must be day, week, or month"))
    
    return data

def validate_unavailable_date(data):
    """
    Unified validator that handles both single date validation and array of dates (JSON string or structured data).
    
    Args:
        data: Can be:
            - A string (JSON array of dates)
            - A dict (single date/range data)
            - A list (array of date/range data)
    
    Returns:
        Validated and processed date data
    """
    if isinstance(data, str):
        try:
            dates = json.loads(data)
            if not isinstance(dates, list):
                raise ValidationError(_("Expected a JSON array of dates"))
            return [validate_unavailable_date(date) for date in dates]
        except json.JSONDecodeError:
            raise ValidationError(_("Invalid JSON format for unavailable dates"))
            
    if isinstance(data, list):
        return [validate_unavailable_date(date) for date in data]
        
    # Single date validation
    if data.get("is_range"):
        if not data.get("range_start") or not data.get("range_end"):
            raise ValidationError(
                _("Range start and end dates are required for date ranges")
            )
        if data["range_end"] < data["range_start"]:
            raise ValidationError(
                _("End date must be after start date")
            )
    elif not data.get("date"):
        raise ValidationError(_("Date is required for single dates"))
    
    return data