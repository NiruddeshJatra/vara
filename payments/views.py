from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.urls import reverse
from .models import Payment
from .serializers import PaymentSerializer
from .sslcommerz import SSLCommerzPayment
import uuid
from django.db import transaction
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page


@method_decorator(cache_page(60 * 15), name='list')
class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        payment = serializer.save(
            user=self.request.user,
            transaction_id=str(uuid.uuid4())
        )
        return self._create_sslcommerz_session(payment)

    def _create_sslcommerz_session(self, payment):
        sslcommerz = SSLCommerzPayment()

        # Prepare payment data
        payment_data = {
            'total_amount': payment.amount,
            'currency': payment.currency,
            'tran_id': payment.transaction_id,
            'success_url': self.request.build_absolute_uri(reverse('payment-success')),
            'fail_url': self.request.build_absolute_uri(reverse('payment-fail')),
            'cancel_url': self.request.build_absolute_uri(reverse('payment-cancel')),
            'customer_name': self.request.user.get_full_name(),
            'customer_email': self.request.user.email,
            'product_name': 'Order Payment'
        }

        # Add billing address if available
        if payment.billing_address:
            payment_data |= {
                'customer_address': payment.billing_address.get('address', ''),
                'customer_city': payment.billing_address.get('city', ''),
                'customer_postcode': payment.billing_address.get('postcode', ''),
                'customer_phone': payment.billing_address.get('phone', ''),
            }

        # Create payment session
        response = sslcommerz.create_session(payment_data)

        if response.get('status') == 'SUCCESS':
            payment.session_key = response.get('sessionkey')
            payment.ssl_status = response
            payment.save()
            return Response({'redirect_url': response.get('GatewayPageURL')})
        else:
            payment.ssl_status = response
            payment.status = 'FAILED'
            payment.save()
            return Response({'error': 'Failed to initiate payment'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def handle_callback(self, request):
        data = request.data
        transaction_id = data.get('tran_id')
        validation_id = data.get('val_id')

        try:
            with transaction.atomic():
                payment = Payment.objects.get(transaction_id=transaction_id)

                if validation_id:
                    # Validate payment
                    sslcommerz = SSLCommerzPayment()
                    validation_response = sslcommerz.validate_payment(validation_id)

                    if validation_response.get('status') in ['VALID', 'VALIDATED']:
                        payment.status = 'COMPLETED'
                    else:
                        payment.status = 'FAILED'

                    payment.payment_details = validation_response
                else:
                    payment.status = 'FAILED'
                    payment.payment_details = data

                payment.save()

                # Handle escrow payment if exists
                if payment.status == 'COMPLETED':
                    try:
                        escrow_payment = payment.escrow_payment
                        rental = escrow_payment.rental
                        rental.status = 'in_progress'
                        rental.save()
                    except (EscrowPayment.DoesNotExist, AttributeError):
                        pass

                return Response({'message': 'Payment processed successfully'})

        except Payment.DoesNotExist:
            return Response({'error': 'Invalid transaction ID'}, status=status.HTTP_400_BAD_REQUEST)
          
          
# Success, Fail, Cancel Views
def payment_success(request):
    return JsonResponse({"status": "success"})


def payment_fail(request):
    return JsonResponse({"status": "failed"})


def payment_cancel(request):
    return JsonResponse({"status": "cancelled"})