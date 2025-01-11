from django.db import models
from users.models import CustomUser
from django.db.models.signals import pre_save
from django.dispatch import receiver
from .utils import compress_image
from django.core.validators import MinValueValidator, FileExtensionValidator

# Create your models here.
class Product(models.Model):
    CATEGORY_CHOICES = [
        ('vehicle', 'Vehicle'),
        ('video_accesories', 'Video Accesories'),
        ('place', 'Place'),
    ]
    
    title = models.CharField(max_length=100, verbose_name="Title", help_text="Enter the property title")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='apartment')
    description = models.TextField(verbose_name="Description", help_text="Detailed description of the property")
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Monthly rent amount"
    )
    image = models.ImageField(
        upload_to="product_images/",
        validators=[FileExtensionValidator(['jpg', 'jpeg', 'png'])]
    )
    location = models.CharField(max_length=255, null=True, blank=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="advertisements"
    )
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Property"
        verbose_name_plural = "Properties"

    def save(self, *args, **kwargs):
        if (self.pk is None or self._state.adding or \
                      Product.objects.get(pk=self.pk).image != self.image) and self.image:
            if compressed_image := compress_image(self.image):
                self.image = compressed_image

        super().save(*args, **kwargs)



    def __str__(self):
        return self.title
