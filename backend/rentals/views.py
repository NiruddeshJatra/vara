from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission
from django.core.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from django.db import transaction
from .models import Rental, RentalPhoto
from .serializers import RentalSerializer, RentalPhotoSerializer
from django.db.models import Q


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
                Q(renter=user) | Q(owner=user)
            )
        elif self.action == "my_rentals":
            return Rental.objects.filter(renter=user)
        elif self.action == "my_listings_rentals":
            return Rental.objects.filter(owner=user)
        return Rental.objects.none()

    def create(self, request, *args, **kwargs):
        """
        Create a new rental request
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Ensure user is not the owner of the product
        if request.user == serializer.validated_data['product'].owner:
            return Response(
                {"error": "You cannot rent your own product"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check product availability
        start_time = serializer.validated_data['start_time']
        end_time = serializer.validated_data['end_time']

        if Rental.objects.filter(
            product=serializer.validated_data['product'],
            status__in=['pending', 'accepted'],
            start_time__lt=end_time,
            end_time__gt=start_time
        ).exists():
            return Response(
                {"error": "Product is not available during the selected period"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create rental with transaction
        with transaction.atomic():
            rental = serializer.save(
                renter=request.user,
                owner=serializer.validated_data['product'].owner,
                status='pending'
            )

            # Add initial status history
            rental.status_history.append({
                "status": "pending",
                "timestamp": timezone.now().isoformat(),
                "note": "Rental request created"
            })
            rental.save()

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

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
            if rental.status != 'pending':
                raise ValidationError(
                    "Rental must be in pending status to accept")

            rental.status = 'accepted'
            rental.status_history.append({
                "status": "accepted",
                "timestamp": timezone.now().isoformat(),
                "note": "Rental request accepted"
            })
            rental.save()

            return Response({"status": "Rental accepted"})
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[IsProductOwner])
    def reject(self, request, pk=None):
        rental = self.get_object()
        try:
            if rental.status != 'pending':
                raise ValidationError(
                    "Rental must be in pending status to reject")

            rental.status = 'rejected'
            rental.status_history.append({
                "status": "rejected",
                "timestamp": timezone.now().isoformat(),
                "note": f"Rental request rejected: {request.data.get('reason', 'No reason provided')}"
            })
            rental.save()

            return Response({"status": "Rental rejected"})
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[IsProductRenter])
    def cancel(self, request, pk=None):
        rental = self.get_object()
        try:
            if rental.status not in ["pending", "accepted"]:
                raise ValidationError(
                    "Can only cancel pending or accepted rentals")

            if rental.start_time < timezone.now():
                raise ValidationError(
                    "Cannot cancel after rental period has started")

            rental.status = "cancelled"
            rental.status_history.append({
                "status": "cancelled",
                "timestamp": timezone.now().isoformat(),
                "note": "Rental cancelled by renter"
            })
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
