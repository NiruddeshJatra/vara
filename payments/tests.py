# tests/test_payments.py
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from decimal import Decimal
from ..models import Payment
from django.contrib.auth import get_user_model


class PaymentModelTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )

        self.payment_data = {
            "user": self.user,
            "amount": Decimal("100.00"),
            "currency": "BDT",
            "payment_method": "CARD",
            "description": "Test payment",
        }

    def test_payment_creation(self):
        payment = Payment.objects.create(**self.payment_data)
        self.assertEqual(payment.status, "PENDING")
        self.assertIsNotNone(payment.created_at)
        self.assertEqual(payment.amount, Decimal("100.00"))

    def test_payment_str_representation(self):
        payment = Payment.objects.create(**self.payment_data)
        expected_str = f"Payment {payment.transaction_id} - {payment.status}"
        self.assertEqual(str(payment), expected_str)


class PaymentAPITests(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.client.force_authenticate(user=self.user)

        self.payment_data = {
            "amount": "100.00",
            "currency": "BDT",
            "payment_method": "CARD",
            "description": "Test payment",
            "billing_address": {
                "street": "Test Street",
                "city": "Test City",
                "country": "Bangladesh",
            },
        }

    def test_create_payment(self):
        url = reverse("payment-list")
        response = self.client.post(url, self.payment_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Payment.objects.count(), 1)
        self.assertEqual(Payment.objects.get().amount, Decimal("100.00"))

    def test_list_payments(self):
        # Create some payments
        Payment.objects.create(
            user=self.user, amount=Decimal("100.00"), payment_method="CARD"
        )
        Payment.objects.create(
            user=self.user, amount=Decimal("200.00"), payment_method="BANK_TRANSFER"
        )

        url = reverse("payment-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_process_payment(self):
        # Create a payment
        payment = Payment.objects.create(
            user=self.user, amount=Decimal("100.00"), payment_method="CARD"
        )

        url = reverse("payment-process-payment", kwargs={"pk": payment.pk})
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Refresh payment from database
        payment.refresh_from_db()
        self.assertEqual(payment.status, "COMPLETED")

    def test_invalid_amount_payment(self):
        self.payment_data["amount"] = "-100.00"
        url = reverse("payment-list")
        response = self.client.post(url, self.payment_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_payment_requires_authentication(self):
        self.client.force_authenticate(user=None)
        url = reverse("payment-list")
        response = self.client.post(url, self.payment_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
