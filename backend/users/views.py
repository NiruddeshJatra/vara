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
from .email_service import send_verification_email, send_password_reset_email
from django.conf import settings

User = get_user_model()


@throttle_classes([UserProfileThrottle])
class UserViewSet(viewsets.ModelViewSet):
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
    ordering_fields = ["created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        if self.action == "list":
            return CustomUser.objects.filter(is_active=True)
        return CustomUser.objects.all()

    def get_serializer_class(self):
        if self.action == "complete_profile":
            return ProfileCompletionSerializer
        return UserProfileSerializer

    def get_object(self):
        if self.action == "me":
            return self.request.user
        return super().get_object()

    @action(detail=False, methods=["get", "put", "patch"])
    def me(self, request):
        # GET: Retrieve user profile
        # PUT/PATCH: Update user profile (partial update supported)
        user = request.user
        if request.method in ["put", "patch"]:
            serializer = self.get_serializer(user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def complete_profile(self, request):
        user = request.user
        serializer = self.get_serializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Profile completed successfully", "data": serializer.data}
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


class CustomLoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthenticationThrottle]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = CustomUser.objects.get(email=email)

            # Check if user exists and is active
            if not user.is_active:
                return Response(
                    {"error": "This account has been deactivated"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            # Check if user's email is verified
            if not user.is_email_verified:
                return Response(
                    {
                        "error": "Email is not verified. Please check your inbox for verification link."
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            # Check password
            if not user.check_password(password):
                return Response(
                    {"error": "Invalid credentials"},
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
                {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )


@method_decorator(csrf_exempt, name="dispatch")
class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        """Check if the verification token is valid"""
        try:
            user = CustomUser.objects.get(email_verification_token=token)
            return Response({"message": "Token is valid", "email": user.email})
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "Invalid verification token"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def post(self, request, token):
        """Verify the email address and generate login tokens"""
        try:
            user = CustomUser.objects.get(email_verification_token=token)

            # Mark email as verified
            user.verify_email()

            # Generate tokens for automatic login
            tokens = TokenSerializer.get_token(user)

            return Response(
                {
                    "message": "Email verified successfully",
                    "user": UserProfileSerializer(
                        user, context={"request": request}
                    ).data,
                    "tokens": tokens,
                }
            )
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "Invalid verification token"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class ResendVerificationEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response(
                {"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = CustomUser.objects.get(email=email)
            if user.is_email_verified:
                return Response(
                    {"error": "Email is already verified"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Generate new verification token and send email
            user.generate_verification_token()
            send_verification_email(user, request)

            return Response({"message": "Verification email sent successfully"})

        except CustomUser.DoesNotExist:
            # For security reasons, don't reveal if the email exists
            return Response(
                {
                    "message": "If your email is registered, a verification link has been sent"
                }
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
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
                    "message": "Registration successful. Please check your email to verify your account.",
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
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = CustomUser.objects.get(email=email)
            
            # Generate password reset token
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Create reset URL - use a default if FRONTEND_URL is not set
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
            reset_url = f"{frontend_url}/auth/reset-password/{uid}/{token}/"
            
            # Send password reset email
            send_password_reset_email(user, reset_url, request)
            
            return Response({
                "message": "If your email is registered, you will receive password reset instructions."
            })
            
        except CustomUser.DoesNotExist:
            # For security reasons, don't reveal if the email exists
            return Response({
                "message": "If your email is registered, you will receive password reset instructions."
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
                    {"error": "Invalid or expired reset link"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get new password from request
            new_password1 = request.data.get('new_password1')
            new_password2 = request.data.get('new_password2')
            
            if not new_password1 or not new_password2:
                return Response(
                    {"error": "Both passwords are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if new_password1 != new_password2:
                return Response(
                    {"error": "Passwords do not match"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Set new password
            user.set_password(new_password1)
            user.save()
            
            return Response({
                "message": "Password has been reset successfully"
            })
            
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            return Response(
                {"error": "Invalid reset link"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@method_decorator(csrf_exempt, name="dispatch")
class LogoutView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Clear the user's session
        if request.session:
            request.session.flush()
        
        # Return success response
        return Response({"message": "Successfully logged out"})
