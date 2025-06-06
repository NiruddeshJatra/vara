# Generated by Django 5.1.4 on 2025-04-21 22:21

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('advertisements', '0002_initial'),
        ('rentals', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='rental',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rentals_as_owner', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='rental',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rentals', to='advertisements.product'),
        ),
        migrations.AddField(
            model_name='rental',
            name='renter',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rentals_as_renter', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='rentalphoto',
            name='rental',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rental_photos', to='rentals.rental'),
        ),
    ]
