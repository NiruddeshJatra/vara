from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Payment
from .serializers import PaymentSerializer
from sslcommerz_python.payment import SSLCSession
from decimal import Decimal
from django.urls import reverse
from django.conf import settings
from django.http import JsonResponse
import uuid


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        payment = serializer.save(
            user=self.request.user,
            transaction_id=str(uuid.uuid4())  # Generate unique transaction ID
        )
        return self._create_sslcommerz_session(payment)

    def _create_sslcommerz_session(self, payment):
        store_id = getattr(settings, "SSLCOMMERZ_STORE_ID", None)
        store_password = getattr(settings, "SSLCOMMERZ_STORE_PASSWORD", None)

        if not store_id or not store_password:
            return Response(
                {"error": "SSLCommerz credentials are not configured."}, status=500
            )

        sslcz = SSLCSession(
            sslc_is_sandbox=True,
            sslc_store_id=store_id,
            sslc_store_pass=store_password
        )

        # Payment URLs
        success_url = self.request.build_absolute_uri(reverse('payment-success'))
        fail_url = self.request.build_absolute_uri(reverse('payment-fail'))
        cancel_url = self.request.build_absolute_uri(reverse('payment-cancel'))

        sslcz.set_urls(success_url=success_url, fail_url=fail_url, cancel_url=cancel_url)
        sslcz.set_product_integration(
            total_amount=Decimal(payment.amount),
            currency=payment.currency,
            product_category="E-commerce",
            product_name="Order Payment",
            num_of_item=1,
            shipping_method="Courier",
            product_profile="general"
        )

        address = payment.billing_address or {}
        sslcz.set_customer_info(
            name=self.request.user.get_full_name(),
            email=self.request.user.email,
            address=address.get('address', ''),
            city=address.get('city', ''),
            postcode=address.get('postcode', ''),
            country="Bangladesh",
            phone=address.get('phone', '')
        )

        # Initialize session and handle response
        response = sslcz.init_payment()
        if response.get('status') == 'SUCCESS':
            payment.session_key = response['sessionkey']
            payment.save()
            return Response({'redirect_url': response['GatewayPageURL']})
        else:
            return Response({'error': 'Failed to initiate payment'}, status=400)

    @action(detail=False, methods=['post'])
    def handle_callback(self, request):
        data = request.data
        transaction_id = data.get('tran_id')

        try:
            payment = Payment.objects.get(transaction_id=transaction_id)
            payment.status = 'COMPLETED' if data.get('status') == 'VALID' else 'FAILED'
            payment.payment_details = data  # Save full response
            payment.save()
            return Response({'message': 'Callback processed successfully.'})
        except Payment.DoesNotExist:
            return Response({'error': 'Invalid transaction ID'}, status=400)


# Success, Fail, Cancel Views
def payment_success(request):
    return JsonResponse({'status': 'success'})

def payment_fail(request):
    return JsonResponse({'status': 'failed'})

def payment_cancel(request):
    return JsonResponse({'status': 'cancelled'})
