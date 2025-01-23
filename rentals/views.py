from rest_framework import viewsets, status
from rest_framework.decorators import action
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.response import Response
from django.utils.timezone import now
from .models import Rental, EscrowPayment
from .serializers import RentalSerializer, EscrowPaymentSerializer
from django.db import transaction
from django.core.exceptions import ValidationError
from django.core.cache import cache


@method_decorator(cache_page(60 * 15), name='list')
class RentalViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing rental instances.
    """
    queryset = Rental.objects.all()
    serializer_class = RentalSerializer

    def get_queryset(self):
        """Customize queryset based on action."""
        user = self.request.user
        if self.action == 'my_rentals':
            return Rental.objects.filter(renter=user)
        elif self.action == 'my_listings_rentals':
            return Rental.objects.filter(owner=user)
        return super().get_queryset()

    @action(detail=False, methods=['get'], url_path='my-rentals')
    def my_rentals(self, request):
        """Retrieve rentals where the user is the renter."""
        rentals = self.get_queryset()
        serializer = self.get_serializer(rentals, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='my-listings-rentals')
    def my_listings_rentals(self, request):
        """Retrieve rentals where the user is the owner."""
        rentals = self.get_queryset()
        serializer = self.get_serializer(rentals, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='accept')
    def accept(self, request, pk=None):
        """Accept a rental request and initiate payment process."""
        rental = self.get_object()

        try:
            with transaction.atomic():
                # Validate payment data
                payment_data = {
                    'payment_method': request.data.get('payment_method', 'CARD'),
                    'billing_address': request.data.get('billing_address', {}),
                    'payment_details': request.data.get('payment_details', {})
                }

                # Use the model's approve_rental method
                payment = rental.approve_rental(payment_data)

                # Initialize payment gateway session
                payment_response = self._create_sslcommerz_session(payment)

                return Response({
                    "status": "Rental accepted",
                    "payment": payment_response.data
                })

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": "Failed to process rental acceptance"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'], url_path='reject')
    def reject(self, request, pk=None):
        """Reject a rental request."""
        rental = self.get_object()
        try:
            rental.reject_rental(reason=request.data.get('reason'))
            return Response({"status": "Rental rejected"})
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='complete')
    def complete(self, request, pk=None):
        """Complete a rental and release escrow payment."""
        rental = self.get_object()
        try:
            rental.complete_rental()
            return Response({"status": "Rental completed and payment released"})
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
          
    def perform_update(self, serializer):
        if serializer.instance.owner != self.request.user:
            raise PermissionDenied("You can only update your own rentals.")
        serializer.save()

    def _create_sslcommerz_session(self, payment):
        # Reuse existing SSLCommerz session creation logic
        payment_viewset = PaymentViewSet()
        payment_viewset.request = self.request
        return payment_viewset.create_sslcommerz_session(payment)