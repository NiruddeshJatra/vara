from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.timezone import now
from .models import Rental
from .serializers import RentalSerializer


class RentalViewSet(viewsets.ModelViewSet):
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
        """Accept a pending rental."""
        rental = self.get_object()
        if rental.status != 'pending':
            return Response({"error": "Only pending rentals can be accepted."}, status=status.HTTP_400_BAD_REQUEST)

        rental.status = 'accepted'
        rental.save()
        return Response({"status": "Rental accepted."})

    @action(detail=True, methods=['post'], url_path='reject')
    def reject(self, request, pk=None):
        """Reject a pending rental."""
        rental = self.get_object()
        if rental.status != 'pending':
            return Response({"error": "Only pending rentals can be rejected."}, status=status.HTTP_400_BAD_REQUEST)

        rental.status = 'rejected'
        rental.save()
        return Response({"status": "Rental rejected."})