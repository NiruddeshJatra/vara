# Generated manually

from django.db import migrations
from django.utils import timezone


def set_default_timestamps(apps, schema_editor):
    """
    Set default values for all auto_now_add fields in existing records
    """
    Product = apps.get_model('advertisements', 'Product')
    # Set default values for all products
    for product in Product.objects.all():
        if not hasattr(product, 'status_changed_at') or product.status_changed_at is None:
            product.status_changed_at = product.created_at or timezone.now()
            product.save(update_fields=['status_changed_at'])


class Migration(migrations.Migration):

    dependencies = [
        ('advertisements', '0014_remove_availabilityperiod_product_and_more'),
    ]

    operations = [
        migrations.RunPython(set_default_timestamps),
    ] 