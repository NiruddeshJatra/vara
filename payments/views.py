from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import transaction
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rentals.models import EscrowPayment
from .models import Payment
from .serializers import PaymentSerializer
import requests
import hmac
import hashlib
from django.conf import settings
import uuid
import logging

logger = logging.getLogger(__name__)

@method_decorator(cache_page(60 * 15), name='list')
class PaymentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling Bkash payments.
    """
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Create a payment and initiate Bkash session."""
        payment = serializer.save(
            user=self.request.user,
            transaction_id=str(uuid.uuid4())
        )
        return self._create_bkash_session(payment)

    def _create_bkash_session(self, payment):
        """Create a real Bkash payment session."""
        try:
            headers = {
                "Authorization": f"Bearer {settings.BKASH_API_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "mode": "0011",
                "payerReference": str(payment.user.id),
                "callbackURL": f"{settings.BACKEND_URL}/payments/handle-callback/",
                "amount": str(payment.amount),
                "currency": "BDT",
                "intent": "sale",
                "merchantInvoiceNumber": payment.transaction_id
            }
            response = requests.post(
                f"{settings.BKASH_API_URL}/checkout/create",
                json=payload,
                headers=headers
            )
            response.raise_for_status()
            
            data = response.json()
            payment.bkash_trx_id = data["paymentID"]
            payment.save(update_fields=["bkash_trx_id"])
            
            return Response({"redirect_url": data["bkashURL"]})
        
        except Exception as e:
            logger.error(f"Bkash API error: {str(e)}")
            return Response(
                {"error": "Payment gateway error"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

    def _validate_bkash_webhook(self, request):
        """Validate HMAC signature for Bkash callbacks."""
        signature = request.headers.get("X-BKASH-SIGNATURE")
        payload = request.body.decode("utf-8")
        generated_signature = hmac.new(
            settings.BKASH_WEBHOOK_SECRET.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(generated_signature, signature)

    def _get_bkash_checkout_url(self, payment):
        """Generate Bkash checkout URL (simulated for MVP)."""
        return f"/bkash/checkout?trx_id={payment.bkash_trx_id}"

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def handle_callback(self, request):
        """Handle Bkash payment callback."""
        data = request.data
        trx_id = data.get('trxID')
        status = data.get('status')

        if not trx_id or not status:
            return Response(
                {"error": "Missing transaction ID or status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                payment = Payment.objects.get(bkash_trx_id=trx_id)
                payment.status = 'COMPLETED' if status == 'success' else 'FAILED'
                payment.payer_mobile = data.get('payerMobile', '')
                payment.save()

                if payment.status == 'COMPLETED':
                    self._handle_successful_payment(payment)

                return Response({"status": "processed"})

        except Payment.DoesNotExist:
            return Response(
                {"error": "Invalid transaction ID"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def _handle_successful_payment(self, payment):
        """Handle post-payment actions (e.g., escrow updates)."""
        try:
            if hasattr(payment, 'escrow_payment'):
                escrow = payment.escrow_payment
                escrow.rental.status = 'in_progress'
                escrow.rental.save()
        except Exception as e:
            logger.error(f"Failed to handle successful payment: {str(e)}")