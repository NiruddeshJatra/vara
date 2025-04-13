from rest_framework import serializers
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from .models import RENTAL_PURPOSE_CHOICES

def validate_rental_data(data):
    """
    Validate rental data with detailed error messages
    """
    errors = {}

    # Validate rental purpose
    if 'purpose' in data:
        valid_purposes = [choice[0] for choice in RENTAL_PURPOSE_CHOICES]
        if data['purpose'] not in valid_purposes:
            errors['purpose'] = [_('Invalid rental purpose. Must be one of: {}').format(
                ', '.join(valid_purposes)
            )]

    # Validate duration and duration_unit
    if 'duration' in data and 'duration_unit' in data:
        duration = data['duration']
        duration_unit = data['duration_unit']
        
        if duration <= 0:
            errors['duration'] = [_('Duration must be greater than 0')]

        if duration_unit not in ['day', 'week', 'month']:
            errors['duration_unit'] = [_('Invalid duration unit. Must be one of: day, week, month')]

        # Check if the duration matches the product's pricing tier
        if 'product' in data:
            product = data['product']
            if not product.pricing_tiers.filter(duration_unit=duration_unit).exists():
                errors['duration_unit'] = [_('This product cannot be rented by {}').format(duration_unit)]

            # Check if duration exceeds max period
            tier = product.pricing_tiers.filter(duration_unit=duration_unit).first()
            if tier and tier.max_period and duration > tier.max_period:
                errors['duration'] = [_('Maximum rental duration is {} {}s').format(
                    tier.max_period, duration_unit
                )]

    # Validate start_time and end_time
    if 'start_time' in data and 'end_time' in data:
        if data['start_time'] >= data['end_time']:
            errors['end_time'] = [_('End time must be after start time')]

        if data['start_time'] < timezone.now():
            errors['start_time'] = [_('Start time cannot be in the past')]

        # Check if the rental period overlaps with any unavailable dates
        if 'product' in data:
            product = data['product']
            for unavailable_date in product.unavailable_dates.all():
                if unavailable_date.is_range:
                    if (data['start_time'].date() <= unavailable_date.range_end and
                        data['end_time'].date() >= unavailable_date.range_start):
                        errors['start_time'] = [_('Selected dates overlap with unavailable period')]
                else:
                    if (data['start_time'].date() <= unavailable_date.date and
                        data['end_time'].date() >= unavailable_date.date):
                        errors['start_time'] = [_('Selected dates include unavailable date')]

    # Validate cost fields
    if 'total_cost' in data and 'service_fee' in data:
        if data['total_cost'] <= 0:
            errors['total_cost'] = [_('Total cost must be greater than 0')]

        if data['service_fee'] < 0:
            errors['service_fee'] = [_('Service fee cannot be negative')]

    if 'notes' in data and data['notes']:
        if len(data['notes']) > 1000:
            errors['notes'] = [_('Notes are too long (maximum 1000 characters)')]

    if errors:
        raise serializers.ValidationError(errors)

    return data

def validate_rental_photo(photo):
    """
    Validate the rental photo file
    """
    # Check file size
    if photo.size > 5 * 1024 * 1024:  # 5MB
        raise serializers.ValidationError(_('Photo size cannot exceed 5MB'))

    # Check file type
    allowed_types = ['image/jpeg', 'image/png', 'image/jpg']
    if photo.content_type not in allowed_types:
        raise serializers.ValidationError(_('Only JPEG and PNG files are allowed'))

    return photo