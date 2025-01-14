from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from .models import Complaint
from .serializers import ComplaintSerializer
from .filters import ComplaintFilter


class ComplaintViewSet(viewsets.ModelViewSet):
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ComplaintFilter
    search_fields = ['description', 'status']
    ordering_fields = ['created_at', 'updated_at', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Complaint.objects.all()
        return Complaint.objects.filter(
            Q(complainant=user) | Q(against_user=user)
        )

    def perform_create(self, serializer):
        # Automatically set the complainant to the logged-in user
        serializer.save(complainant=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def resolve(self, request, pk=None):
        """
        Custom action for admins to resolve a complaint.
        """
        complaint = self.get_object()

        # Update the status and resolution date
        complaint.status = 'resolved'
        complaint.resolution_date = timezone.now()
        complaint.admin_notes = request.data.get('admin_notes', '')
        complaint.save()

        # Return the updated complaint
        return Response(
            ComplaintSerializer(complaint).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def cancel(self, request, pk=None):
        """
        Custom action for admins to cancel a complaint.
        """
        complaint = self.get_object()

        # Update the status to 'cancelled'
        complaint.status = 'cancelled'
        complaint.save()

        return Response(
            ComplaintSerializer(complaint).data,
            status=status.HTTP_200_OK
        )
