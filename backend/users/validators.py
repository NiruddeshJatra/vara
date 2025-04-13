from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from datetime import date
import re
from .models import CustomUser


def validate_profile_picture(value):
    """
    Validate the profile picture file.
    
    Args:
        value: The uploaded file object
            
    Returns:
        The validated file object
            
    Raises:
        ValidationError: If the file size exceeds 5MB or if the file is invalid
    """
    try:
        if value.size > 5 * 1024 * 1024:  # 5MB limit
            raise serializers.ValidationError(_("Image size cannot exceed 5MB"))
    
    except AttributeError as e:
        raise serializers.ValidationError(_("Invalid file upload")) from e

    return value


def validate_registration_data(data):
    """
    Validate the registration data.
    
    Args:
        data: The data to validate
            
    Returns:
        The validated data
            
    Raises:
        ValidationError: If passwords don't match or username is already taken
    """
    errors = {}

    # Check if passwords match
    if data.get("password1") != data.get("password2"):
        errors["password2"] = [_("Passwords do not match")]

    # Check if username is already taken
    if CustomUser.objects.filter(username=data.get("username")).exists():
        errors["username"] = [_("Username is already taken")]

    # Check if email is already taken
    if CustomUser.objects.filter(email=data.get("email")).exists():
        errors["email"] = [_("Email is already registered")]

    if errors:
        raise serializers.ValidationError(errors)

    return data


def validate_date_of_birth(date_of_birth):
    """
    Validate the date of birth.
    
    Args:
        date_of_birth: The date of birth to validate
            
    Returns:
        The validated date of birth
            
    Raises:
        ValidationError: If the date of birth is invalid
    """
    if date_of_birth:
        today = date.today()
        age = today.year - date_of_birth.year - ((today.month, today.day) < (date_of_birth.month, date_of_birth.day))
        
        if age < 18:
            raise serializers.ValidationError(_("You must be at least 18 years old to use this service"))
        
        if age > 120:
            raise serializers.ValidationError(_("Please enter a valid date of birth"))
            
    return date_of_birth


def validate_phone_number(phone_number):
    """
    Validate the phone number format.
    
    Args:
        phone_number: The phone number to validate
            
    Returns:
        The validated phone number
            
    Raises:
        ValidationError: If the phone number format is invalid
    """
    if phone_number:
        if not re.match(r"^(\+?88)?01[5-9]\d{8}$", phone_number):
            raise serializers.ValidationError(_("Invalid phone number format"))
    return phone_number


def validate_national_id_number(value, instance=None):
    """
    Validate the national ID number.
    
    Args:
        value: The national ID number to validate
        instance: The current user instance (for updates)
            
    Returns:
        The validated national ID number
            
    Raises:
        ValidationError: If the national ID number is invalid
    """
    if value:
        # Check if the national ID number is already in use
        if CustomUser.objects.filter(national_id_number=value).exclude(id=instance.id if instance else None).exists():
            raise serializers.ValidationError(_("This national ID number is already registered"))
    return value


def validate_profile_completion(data):
    """
    Validate the profile completion data.
    
    Args:
        data: The data to validate
            
    Returns:
        The validated data
            
    Raises:
        ValidationError: If required fields are missing
    """
    # Ensure all required fields are present
    required_fields = [
        "first_name",
        "last_name",
        "phone_number",
        "location",
        "date_of_birth",
    ]
    
    errors = {}
    for field in required_fields:
        if not data.get(field):
            errors[field] = [_("{field} is required for profile completion").format(
                field=field.replace('_', ' ').title()
            )]
    
    if errors:
        raise serializers.ValidationError(errors)
    
    return data