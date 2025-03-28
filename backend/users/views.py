from rest_framework import viewsets, status, filters
from rest_framework.decorators import throttle_classes, action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from dj_rest_auth.views import LoginView
from dj_rest_auth.registration.views import VerifyEmailView
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.sessions.models import Session
from .models import CustomUser
from .serializers import UserProfileSerializer, ProfilePictureSerializer
from .filters import UserFilter
from .throttles import AuthenticationThrottle, UserProfileThrottle


@throttle_classes([UserProfileThrottle])
class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.filter(is_active=True)
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = UserFilter
    search_fields = ["username", "email", "first_name", "last_name", "location", "is_trusted"]
    ordering_fields = ["created_at"]
    ordering = ["-created_at"]

    # Django and dj‑rest‑auth don't offer a dedicated endpoint for the authenticated user to fetch or update their own profile.
    # Instead, the custom "me" action enables users to retrieve and update their profile using the same endpoint.
    # BLACKBOX - use whenever you need to get the user's profile and update the user's profile.
    @action(detail=False, methods=["get", "put", "patch"])
    def me(self, request):
        # GET: Retrieve user profile
        if request.method == "GET":
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)

        # PUT/PATCH: Update user profile (partial update supported)
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DRF's default parsers (like JSONParser) are not designed to handle multipart form data. 
    # If the request contains a file upload, the default parsers will not be able to process it correctly, leading to errors.
    # To handle file uploads, you need to use MultiPartParser and FormParser.
    # BLACKBOX - use whenever you need to upload a profile picture.
    @action(detail=False, methods=["post"], parser_classes=[MultiPartParser, FormParser])
    def upload_picture(self, request):
        # POST: Upload a new profile picture and delete the old one if exists.
        serializer = ProfilePictureSerializer(
            request.user, data=request.data, partial=True
        )
        if serializer.is_valid():
            if request.user.profile_picture:
                request.user.profile_picture.delete()
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    # BLACKBOX - use whenever you need to delete the user's account.
    @action(detail=False, methods=["delete"])
    def delete_account(self, request):
        user = request.user
        password = request.data.get("password")
        if not password:
            return Response(
                {"error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(password):
            return Response(
                {"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Soft delete: Mark user as inactive.
        user.is_active = False
        user.save()

        # Delete the session
        Session.objects.filter(session_key=request.session.session_key).delete()

        return Response(
            {"detail": "Account deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )


# By default, Django-Allauth creates the user account immediately upon registration and then sends a verification email.
# To ensure that only verified users can log in, the login view is customized to check the user's verification status.
# This is created to have an extra check on email verification.
@throttle_classes([AuthenticationThrottle])
class CustomLoginView(LoginView):
    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data.get("user")
            
            # This part is customized to check if the user is verified or not.
            if user and not user.is_verified:
                from rest_framework.exceptions import AuthenticationFailed
                
                print(f"Unverified login attempt: {user.email}")
                raise AuthenticationFailed("Email address is not verified.")
            
            return super().post(request, *args, **kwargs)
                
        except Exception as e:
            print(f"Login error: {str(e)}")
            raise e
        
        
    
# added a manager to delete unverified users who registered more than a week ago.

class CustomVerifyEmailView(VerifyEmailView):
    def get(self, request, *args, **kwargs):
        token = kwargs.get('token')
        if not token:
            return Response({'detail': 'Invalid verification token'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            # Split the token to get user_id and email
            user_id, email = token.split('_')
            user = CustomUser.objects.get(id=user_id, email=email)
            
            if user.is_email_verified:
                return Response({'detail': 'Email already verified'}, status=status.HTTP_200_OK)
                
            user.is_email_verified = True
            user.save()
            
            return Response({
                'detail': 'Email verified successfully',
                'is_verified': True
            }, status=status.HTTP_200_OK)
            
        except (ValueError, CustomUser.DoesNotExist):
            return Response({'detail': 'Invalid verification token'}, status=status.HTTP_400_BAD_REQUEST)