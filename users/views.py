from rest_framework.decorators import throttle_classes
from .throttles import AuthenticationThrottle
from dj_rest_auth.views import LoginView as DefaultLoginView
from rest_framework import viewsets, status, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from rest_framework.views import APIView
from .models import CustomUser
from .serializers import UserProfileSerializer, ProfilePictureSerializer
from .filters import UserFilter
from django.contrib.sessions.models import Session


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.filter(is_active=True)
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = UserFilter
    search_fields = ['username', 'email', 'first_name', 'last_name', 'location']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

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
            if request.user.profile_picture:
                request.user.profile_picture.delete()
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
        Session.objects.filter(session_key=request.session.session_key).delete()
        
        return Response({"detail": "Account deleted successfully"}, status=204)
      

@throttle_classes([AuthenticationThrottle])
class CustomLoginView(DefaultLoginView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data.get('user')
        if user and not user.is_verified:
            from rest_framework.exceptions import AuthenticationFailed
            raise AuthenticationFailed("Email address is not verified.")
        return super().post(request, *args, **kwargs)
  
  
class VerifyEmailView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)
            
            if default_token_generator.check_token(user, token):
                user.is_verified = True
                user.save()
                return Response({"detail": "Email verified successfully!"})
            
            return Response({"error": "Invalid token"}, status=400)
            
        except Exception as e:
            return Response({"error": "Verification failed"}, status=400)