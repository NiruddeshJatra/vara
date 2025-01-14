from django.db import models
from users.models import CustomUser
from .utils import compress_image
from django.core.validators import MinValueValidator, FileExtensionValidator
from .constants import CATEGORY_CHOICES, CATEGORY_GROUPS

# Create your models here.
class Product(models.Model):
    title = models.CharField(max_length=100, verbose_name="Title", help_text="Enter the property title")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, verbose_name="Category", help_text="Select the category that best describes your item")
    description = models.TextField(verbose_name="Description", help_text="Detailed description of the property")
    image = models.ImageField(
        upload_to="product_images/",
        validators=[FileExtensionValidator(['jpg', 'jpeg', 'png'])]
    )
    security_deposit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Security deposit required for renting"
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
        
    @classmethod
    def get_category_group(cls, category):
        """Return the group name for a given category"""
        for group, categories in CATEGORY_GROUPS.items():
            if category in categories:
                return group
        return None

    def __str__(self):
        return self.title


class PricingOption(models.Model):
    DURATION_CHOICES = [
        ('hour', 'Per Hour'),
        ('day', 'Per Day'),
        ('week', 'Per Week'),
        ('month', 'Per Month'),
    ]

    product = models.OneToOneField(
        'Product', 
        on_delete=models.CASCADE,
        related_name='pricing'
    )
    base_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Base rental price"
    )
    duration_unit = models.CharField(
        max_length=5,
        choices=DURATION_CHOICES,
        default='day',
        help_text="Price per duration unit"
    )
    minimum_rental_period = models.PositiveIntegerField(
        default=1,
        help_text="Minimum rental period in selected duration units"
    )
    maximum_rental_period = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Maximum rental period in selected duration units (leave blank for no limit)"
    )
    
    class Meta:
        verbose_name = "Pricing Option"
        verbose_name_plural = "Pricing Options"



class AvailabilityPeriod(models.Model):
    product = models.ForeignKey(
        'Product',
        on_delete=models.CASCADE,
        related_name='availability_periods'
    )
    start_date = models.DateField()
    end_date = models.DateField()
    is_available = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['start_date']
        verbose_name = "Availability Period"
        
    def clean(self):
        if self.end_date < self.start_date:
            raise ValidationError("End date must be greater than or equal to start date.")