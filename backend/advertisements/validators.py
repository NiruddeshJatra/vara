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
    # Handle JSON string or list input recursively
    if isinstance(data, str):
        try:
            tiers = json.loads(data)
            if not isinstance(tiers, list):
                raise serializers.ValidationError(_("Expected a JSON array of pricing tiers"))
            return [validate_pricing_tier(tier) for tier in tiers]
        except json.JSONDecodeError:
            raise serializers.ValidationError(_("Invalid JSON format for pricing tiers"))
    if isinstance(data, list):
        return [validate_pricing_tier(tier) for tier in data]

    # --- Robust field presence/type checks ---
    # Validate price
    price = data.get("price")
    if price is None:
        raise serializers.ValidationError(_("Price is required for each pricing tier."))
    if not isinstance(price, (int, float)):
        raise serializers.ValidationError(_("Price must be a number."))
    if price <= 0:
        raise serializers.ValidationError(_("Price must be greater than 0."))

    # Validate max_period
    max_period = data.get("max_period")
    if max_period is None:
        raise serializers.ValidationError(_("Max period is required for each pricing tier."))
    if not isinstance(max_period, int):
        raise serializers.ValidationError(_("Max period must be an integer."))
    if max_period <= 0:
        raise serializers.ValidationError(_("Max period must be greater than 0."))

    # Validate duration_unit
    duration_unit = data.get("duration_unit")
    if not duration_unit:
        raise serializers.ValidationError(_("Duration unit is required."))
    if duration_unit not in ["day", "week", "month"]:
        raise serializers.ValidationError(_("Invalid duration unit. Must be day, week, or month."))

    return data

def validate_unavailable_date(data):
    if isinstance(data, str):
        try:
            dates = json.loads(data)
            if not isinstance(dates, list):
                raise serializers.ValidationError(_("Expected a JSON array of dates"))
            return [validate_unavailable_date(date) for date in dates]
        except json.JSONDecodeError:
            raise serializers.ValidationError(_("Invalid JSON format for unavailable dates"))
            
    if isinstance(data, list):
        return [validate_unavailable_date(date) for date in data]
        
    # Single date validation
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