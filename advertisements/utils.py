from PIL import Image
from io import BytesIO
from django.core.files import File

def compress_image(image):
    if image:
        img = Image.open(image)
        
        if img.mode != 'RGB':
            img = img.convert('RGB')
            
        MAX_SIZE = (800, 800)  # Maximum dimensions
        img.thumbnail(MAX_SIZE, Image.Resampling.LANCZOS)
        
        output = BytesIO()
        img.save(output, format='JPEG', quality=70, optimize=True)
        output.seek(0)
        
        return File(output, name=image.name)
    return None