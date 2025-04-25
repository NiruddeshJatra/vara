from rest_framework import viewsets, status, filters
from rest_framework.decorators import throttle_classes, action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.sessions.models import Session
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.utils.translation import gettext_lazy as _
from .models import CustomUser
from .serializers import (
    UserProfileSerializer,
    ProfilePictureSerializer,
    ProfileCompletionSerializer,
    TokenSerializer,
    CustomRegisterSerializer,
)
from .filters import UserFilter
from .throttles import AuthenticationThrottle, UserProfileThrottle
from .email_service import send_password_reset_email
from django.conf import settings
from users.tasks import send_verification_email_task, send_password_reset_email_task

User = get_user_model()


@throttle_classes([UserProfileThrottle])
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing user profiles.
    
    This viewset provides CRUD operations for user profiles, with appropriate
    permissions and throttling.
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = UserFilter
    search_fields = [
        "username",
        "email",
        "first_name",
        "last_name",
        "location",
        "is_trusted",
    ]
    ordering_fields = ["created_at", "average_rating", "last_login"]
    ordering = ["-created_at"]

    def get_queryset(self):
        """
        Filter the queryset based on the current user's permissions.
        
        Returns:
            QuerySet: The filtered queryset
        """
        # Admins can see all users
        if self.request.user.is_staff:
            return CustomUser.objects.all()
        
        # Regular users can only see their own profile
        return CustomUser.objects.filter(id=self.request.user.id)

    def get_serializer_class(self):
        if self.action == "complete_profile":
            return ProfileCompletionSerializer
        return UserProfileSerializer

    def get_object(self):
        if self.action == "me":
            return self.request.user
        return super().get_object()

    @action(detail=False, methods=["get"])
    def me(self, request):
        """Get the current user's profile."""
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=["put", "patch"])
    def update_profile(self, request):
        """Update the current user's profile."""
        user = request.user
        
        # Map frontend camelCase field names to backend snake_case field names
        mapped_data = {}
        field_mapping = {
            'firstName': 'first_name',
            'lastName': 'last_name',
            'email': 'email',
            'phone': 'phone_number',
            'location': 'location',
            'dateOfBirth': 'date_of_birth',
            'bio': 'bio',
            'profilePicture': 'profile_picture'
        }
        
        # Map the field names correctly
        for frontend_field, backend_field in field_mapping.items():
            if frontend_field in request.data:
                mapped_data[backend_field] = request.data.get(frontend_field)
        
        # Handle file uploads separately
        if 'profilePicture' in request.FILES:
            mapped_data['profile_picture'] = request.FILES.get('profilePicture')
        
        serializer = self.get_serializer(user, data=mapped_data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            user.refresh_from_db()  # Refresh to ensure we get the updated data
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Return updated profile data
        updated_serializer = self.get_serializer(user)
        return Response(updated_serializer.data)

    @action(detail=False, methods=["post"])
    def complete_profile(self, request):
        """
        Complete the user's profile with additional information.
        
        This action validates and saves additional profile information and marks
        the profile as completed.
        
        Returns:
            Response: The updated user profile data
        """
        user = request.user
        serializer = self.get_serializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Set profile_completed to True before saving
        serializer.validated_data['profile_completed'] = True
        serializer.save()
        
        return Response(
            {
                "message": _("Profile completed successfully"),
                "data": serializer.data,
                "profile_completed": True
            },
            status=status.HTTP_200_OK
        )

    @action(
        detail=False, methods=["post"], parser_classes=[MultiPartParser, FormParser]
    )
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

    @action(detail=False, methods=["delete"])
    def delete_account(self, request):
        user = request.user
        password = request.data.get("password")
        if not password:
            return Response(
                {"error": _("Password is required")}, status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(password):
            return Response(
                {"error": _("Invalid password")}, status=status.HTTP_400_BAD_REQUEST
            )

        # Soft delete: Mark user as inactive.
        user.is_active = False
        user.save()

        # Delete the session
        Session.objects.filter(session_key=request.session.session_key).delete()

        return Response(
            {"detail": _("Account deleted successfully")},
            status=status.HTTP_204_NO_CONTENT,
        )


class CustomLoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthenticationThrottle]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": _("Email and password are required")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = CustomUser.objects.get(email=email)

            # Check if user exists and is active
            if not user.is_active:
                return Response(
                    {"error": _("This account has been deactivated")},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            # Check if user's email is verified
            if not user.is_email_verified:
                return Response(
                    {
                        "error": _("Email is not verified. Please check your inbox for verification link.")
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            # Check password
            if not user.check_password(password):
                return Response(
                    {"error": _("Invalid credentials")},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            # Generate tokens
            tokens = TokenSerializer.get_token(user)

            # Handle remember me
            remember = request.data.get("remember", False)
            if remember:
                # Set session expiry to 30 days
                request.session.set_expiry(30 * 24 * 60 * 60)
            else:
                # Set session expiry to browser close
                request.session.set_expiry(0)

            # Return user data and tokens
            return Response(
                {
                    "user": UserProfileSerializer(
                        user, context={"request": request}
                    ).data,
                    "tokens": tokens,
                }
            )

        except CustomUser.DoesNotExist:
            return Response(
                {"error": _("Invalid credentials")}, status=status.HTTP_401_UNAUTHORIZED
            )


@method_decorator(csrf_exempt, name="dispatch")
class VerifyEmailView(APIView):
    """
    API endpoint for email verification.
    
    This view handles the email verification process, validating the token
    and updating the user's verification status.
    """
    permission_classes = [AllowAny]

    def get(self, request, token):
        """
        Verify a user's email with the provided token.
        
        Args:
            request: The HTTP request
            token: The verification token
            
        Returns:
            Response: The verification result
        """
        try:
            user = CustomUser.objects.get(email_verification_token=token)
            user.verify_email()

            # Generate tokens for the user
            token_serializer = TokenSerializer.get_token(user)

            return Response(
                {
                    "message": _("Email verified successfully."),
                    "tokens": token_serializer,
                },
                status=status.HTTP_200_OK,
            )
        except CustomUser.DoesNotExist:
            return Response(
                {"error": _("Invalid verification token.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def post(self, request, token):
        """
        Verify the email address and generate login tokens
        
        Args:
            request: The HTTP request
            token: The verification token
            
        Returns:
            Response: The verification result
        """
        try:
            user = CustomUser.objects.get(email_verification_token=token)

            # Mark email as verified
            user.verify_email()

            # Generate tokens for automatic login
            tokens = TokenSerializer.get_token(user)

            return Response(
                {
                    "message": _("Email verified successfully"),
                    "user": UserProfileSerializer(
                        user, context={"request": request}
                    ).data,
                    "tokens": tokens,
                }
            )
        except CustomUser.DoesNotExist:
            return Response(
                {"error": _("Invalid verification token")},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class ResendVerificationEmailView(APIView):
    """
    API endpoint for resending verification emails.
    
    This view allows users to request a new verification email if they didn't
    receive the first one or if it expired.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Resend a verification email to the user.
        
        Args:
            request: The HTTP request
            
        Returns:
            Response: The result of the resend operation
        """
        email = request.data.get("email")
        if not email:
            return Response(
                {"error": _("Email is required.")}, status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = CustomUser.objects.get(email=email)
            if user.is_email_verified:
                return Response(
                    {"message": _("Email is already verified.")},
                    status=status.HTTP_200_OK,
                )
            
            # Generate a new token and send the email asynchronously via Celery
            user.generate_verification_token()
            request_meta = None
            if request:
                request_meta = {
                    'HTTP_HOST': request.META.get('HTTP_HOST'),
                    'HTTP_ORIGIN': request.META.get('HTTP_ORIGIN'),
                    'SCHEME': request.scheme
                }
            send_verification_email_task.delay(user.id, request_meta)
            
            return Response(
                {"message": _("Verification email sent successfully.")},
                status=status.HTTP_200_OK,
            )
        except CustomUser.DoesNotExist:
            return Response(
                {"error": _("User with this email does not exist.")},
                status=status.HTTP_404_NOT_FOUND,
            )


@method_decorator(csrf_exempt, name="dispatch")
class CustomRegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthenticationThrottle]

    def post(self, request):
        serializer = CustomRegisterSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "message": _("Registration successful. Please check your email to verify your account."),
                    "user": UserProfileSerializer(user, context={"request": request}).data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthenticationThrottle]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response(
                {"error": _("Email is required")},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = CustomUser.objects.get(email=email)
            # Generate password reset token
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
            reset_url = f"{frontend_url}/auth/reset-password/{uid}/{token}/"
            request_meta = None
            if request:
                request_meta = {
                    'HTTP_HOST': request.META.get('HTTP_HOST'),
                    'HTTP_ORIGIN': request.META.get('HTTP_ORIGIN'),
                    'SCHEME': request.scheme
                }
            # Send password reset email asynchronously via Celery
            send_password_reset_email_task.delay(user.id, reset_url, request_meta)
            return Response({
                "message": _("If your email is registered, you will receive password reset instructions.")
            })
        except CustomUser.DoesNotExist:
            # For security reasons, don't reveal if the email exists
            return Response({
                "message": _("If your email is registered, you will receive password reset instructions.")
            })
        except Exception as e:
            print(f"Password reset error: {str(e)}")  # Add debug logging
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@method_decorator(csrf_exempt, name="dispatch")
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthenticationThrottle]

    def post(self, request, uidb64, token):
        try:
            # Decode user ID
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)
            
            # Verify token
            if not default_token_generator.check_token(user, token):
                return Response(
                    {"error": _("Invalid or expired reset link")},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get new password from request
            new_password1 = request.data.get('new_password1')
            new_password2 = request.data.get('new_password2')
            
            if not new_password1 or not new_password2:
                return Response(
                    {"error": _("Both passwords are required")},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if new_password1 != new_password2:
                return Response(
                    {"error": _("Passwords do not match")},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Set new password
            user.set_password(new_password1)
            user.save()
            
            return Response({
                "message": _("Password has been reset successfully")
            })
            
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            return Response(
                {"error": _("Invalid reset link")},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CheckNationalIdView(APIView):
    """
    API endpoint to check if a national ID is already registered.
    Accepts GET requests with 'national_id_number' as a query parameter.
    Returns 400 if missing, 200 with exists status otherwise.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        national_id = request.query_params.get('national_id_number')
        if not national_id:
            return Response({"error": _("National ID number is required")}, status=status.HTTP_400_BAD_REQUEST)

        exists = CustomUser.objects.filter(national_id_number=national_id).exists()
        return Response({"exists": exists}, status=status.HTTP_200_OK)

@method_decorator(csrf_exempt, name="dispatch")
class LogoutView(APIView):
    """
    API endpoint for user logout.
    
    This view handles the logout process, invalidating the user's session
    and blacklisting their refresh token.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Log out the current user.
        
        Args:
            request: The HTTP request
            
        Returns:
            Response: The logout result
        """
        try:
            # Blacklist the refresh token
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            # Invalidate the session
            Session.objects.filter(session_key=request.session.session_key).delete()
            
            return Response(
                {"message": _("Logged out successfully.")},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
