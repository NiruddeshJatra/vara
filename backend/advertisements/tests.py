from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Product

class ProductTests(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser8',
            email='testuser8@gmail.com',
            password='testpass123'
        )
        
    def test_create_product(self):
        product = Product.objects.create(
            title="Test Property",
            description="Test Description",
            price=1000.00,
            user=self.user
        )
        self.assertEqual(product.title, "Test Property")
        self.assertEqual(product.user, self.user)