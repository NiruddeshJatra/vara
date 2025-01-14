from rest_framework.decorators import throttle_classes
from .throttles import AuthenticationThrottle
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.timezone import now
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import update_session_auth_hash
from .models import CustomUser
from .serializers import UserProfileSerializer


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = UserFilter
    search_fields = ['username', 'email', 'first_name', 'last_name', 'location']
    ordering_fields = ['date_joined', 'created_at']
    ordering = ['-date_joined']

    def get_queryset(self):
        if self.action in ['list', 'retrieve']:
            return CustomUser.objects.filter(is_active=True)
        return CustomUser.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
      
        
    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_picture(self, request):
        serializer = ProfilePictureSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            # Delete old picture if it exists
            if request.user.profile_picture:
                request.user.profile_picture.delete()
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    @action(detail=False, methods=['post'])
    def update_social_links(self, request):
        serializer = SocialLinksSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    @action(detail=False, methods=['delete'])
    def delete_account(self, request):
        user = request.user
        if not user.check_password(request.data.get('password')):
            return Response({"error": "Invalid password"}, status=400)
        
        # Soft delete
        user.is_active = False
        user.save()
        
        # Or hard delete
        # user.delete()
        
        return Response(status=204)
      
    @throttle_classes([AuthenticationThrottle])
    class LoginView(APIView):
        def post(self, request):
            serializer = LoginSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.validated_data['user']
                login(request, user)
                return Response(UserSerializer(user).data)
            return Response(serializer.errors, status=400)