from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission
from django.core.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Rental, RentalPhoto
from .serializers import RentalSerializer, RentalPhotoSerializer


class RentalViewSet(viewsets.ModelViewSet):
    serializer_class = RentalSerializer
    permission_classes = [IsAuthenticated]

    class IsProductRenter(BasePermission):
        def has_object_permission(self, request, view, obj):
            return request.user == obj.renter
          
    class IsProductOwner(BasePermission):
        def has_object_permission(self, request, view, obj):
            return request.user == obj.owner

    def get_queryset(self):
        user = self.request.user
        if self.action == "list":
            return Rental.objects.filter(
                models.Q(renter=user) | models.Q(owner=user)
            )
        elif self.action == "my_rentals":
            return Rental.objects.filter(renter=user)
        elif self.action == "my_listings_rentals":
            return Rental.objects.filter(owner=user)
        return Rental.objects.none()

    @action(detail=False, methods=["get"], url_path="my-rentals")
    def my_rentals(self, request):
        rentals = self.get_queryset()
        serializer = self.get_serializer(rentals, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="my-listings-rentals")
    def my_listings_rentals(self, request):
        rentals = self.get_queryset()
        serializer = self.get_serializer(rentals, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsProductOwner])
    def accept(self, request, pk=None):
        rental = self.get_object()
        try:
            rental.approve_rental()
            return Response({"status": "Rental accepted"})
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[IsProductOwner])
    def reject(self, request, pk=None):
        rental = self.get_object()
        try:
            rental.reject_rental(reason=request.data.get('reason'))
            return Response({"status": "Rental rejected"})
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[IsProductRenter])
    def cancel(self, request, pk=None):
        rental = self.get_object()
        try:
            if rental.status not in ["pending", "accepted"]:
                raise ValidationError("Can only cancel pending or accepted rentals")
                
            if rental.start_time < timezone.now():
                raise ValidationError("Cannot cancel after rental period has started")
                
            rental.status = "cancelled"
            rental.save()
            return Response({"status": "Rental cancelled"})
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RentalPhotoViewSet(viewsets.ModelViewSet):
    serializer_class = RentalPhotoSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RentalPhoto.objects.filter(
            rental_id=self.kwargs['rental_pk']
        ).select_related('rental')
