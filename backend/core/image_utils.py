import os
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys
from django.core.exceptions import ValidationError

def validate_image_file_extension(value):
    """
    Validate that the uploaded file is an image.
    """
    valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    ext = os.path.splitext(value.name)[1].lower()
    if ext not in valid_extensions:
        raise ValidationError('Unsupported file extension. Supported formats: JPG, JPEG, PNG, GIF, WEBP')

def resize_image(image_field, size=(500, 500), quality=85):
    """
    Resize the given image to the specified size while maintaining aspect ratio.
    
    Args:
        image_field: The ImageFieldFile to resize
        size: Tuple of (width, height)
        quality: Image quality (1-100)
        
    Returns:
        InMemoryUploadedFile: The resized image
    """
    if not image_field:
        return None
        
    # Open the image
    img = Image.open(image_field)
    
    # Convert to RGB if necessary (for PNGs with transparency)
    if img.mode in ('RGBA', 'P'):
        img = img.convert('RGB')
    
    # Resize while maintaining aspect ratio
    img.thumbnail(size, Image.Resampling.LANCZOS)
    
    # Save the image to a BytesIO object
    output = BytesIO()
    img_format = 'JPEG'  # Default format
    
    # Determine the format
    ext = os.path.splitext(image_field.name)[1].lower()
    if ext == '.png':
        img_format = 'PNG'
    elif ext == '.webp':
        img_format = 'WEBP'
    
    # Save with the appropriate format and quality
    img.save(output, format=img_format, quality=quality, optimize=True)
    
    # Create a new InMemoryUploadedFile
    output.seek(0)
    return InMemoryUploadedFile(
        output,
        'ImageField',
        f"{os.path.splitext(image_field.name)[0]}.{img_format.lower()}",
        f'image/{img_format.lower() if img_format != "jpg" else "jpeg"}',
        sys.getsizeof(output),
        None
    )
