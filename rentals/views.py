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
from rest_framework.exceptions import PermissionDenied 
from payments.views import PaymentViewSet        

@method_decorator(cache_page(60 * 15), name='list')
class RentalViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling rental operations.
    """
    # Main queryset for all rentals.
    queryset = Rental.objects.all()
    # Serializer to handle Rental objects.
    serializer_class = RentalSerializer

    def get_queryset(self):
        """Customize queryset based on action and current user."""
        user = self.request.user
        # Filter rentals for the renter.
        if self.action == 'my_rentals':
            return Rental.objects.filter(renter=user)  # Rentals where user is renter
        # Filter rentals for the owner.
        elif self.action == 'my_listings_rentals':
            return Rental.objects.filter(owner=user)  # Rentals where user is owner
        # Default to the base queryset.
        return super().get_queryset()

    @action(detail=False, methods=['get'], url_path='my-rentals')
    def my_rentals(self, request):
        # Retrieve and serialize rentals for the renter.
        rentals = self.get_queryset()
        serializer = self.get_serializer(rentals, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='my-listings-rentals')
    def my_listings_rentals(self, request):
        # Retrieve and serialize rentals for the owner.
        rentals = self.get_queryset()
        serializer = self.get_serializer(rentals, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='accept')
    def accept(self, request, pk=None):
        # Accept rental and begin escrow payment process.
        rental = self.get_object()
        try:
            with transaction.atomic():
                # Extract payment data from the request.
                payment_data = {
                    'payment_method': request.data.get('payment_method', 'CARD'),
                    'billing_address': request.data.get('billing_address', {}),
                    'payment_details': request.data.get('payment_details', {})
                }
                # Approve the rental, which creates a Payment record.
                payment = rental.approve_rental(payment_data)  # Approve rental and create payment
                # Start a payment session.
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
        # Reject rental request with an optional reason.
        rental = self.get_object()
        try:
            # Invoke rejection logic.
            rental.reject_rental(reason=request.data.get('reason'))
            return Response({"status": "Rental rejected"})
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='complete')
    def complete(self, request, pk=None):
        # Complete rental and trigger escrow release.
        rental = self.get_object()
        try:
            rental.complete_rental()
            return Response({"status": "Rental completed and payment released"})
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
          
    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel(self, request, pk=None):
        # Cancel rental if in pending status.
        rental = self.get_object()
        try:
            if rental.status != "pending":
                raise ValidationError("Can only cancel pending rental requests.")
            rental.status = "cancelled"
            rental.save()
            return Response({"status": "Rental cancelled"})
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
          
    def perform_update(self, serializer):
        # Only allow owners to update their own rentals.
        if serializer.instance.owner != self.request.user:
            raise PermissionDenied("You can only update your own rentals.")
        serializer.save()

    def _create_sslcommerz_session(self, payment):
        # Create payment session via PaymentViewSet.
        payment_viewset = PaymentViewSet()
        payment_viewset.request = self.request
        return payment_viewset.create_sslcommerz_session(payment)