# Utility functions for processing advertisement images.

from PIL import Image
from io import BytesIO
from django.core.files import File
from django.core.exceptions import ValidationError

def compress_image(image):
    # Attempt to compress an image to JPEG format with max dimensions and quality settings.
    try:
        img = Image.open(image)
        
        # Convert image to RGB if it is not already in that mode.
        if img.mode != 'RGB':
            img = img.convert('RGB')
            
        MAX_SIZE = (800, 800)  # Maximum allowed dimensions.
        img.thumbnail(MAX_SIZE, Image.Resampling.LANCZOS)
        
        output = BytesIO()
        # Save the image in JPEG format while optimizing and reducing quality.
        img.save(output, format='JPEG', quality=70, optimize=True)
        output.seek(0)
        
        return File(output, name=image.name)
    except Exception as e:
        # If any error occurs, raise a validation error.
        raise ValidationError("Invalid image file") from e