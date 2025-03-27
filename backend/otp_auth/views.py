from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import SendOTPSerializer, VerifyOTPSerializer
from .models import PhoneOTP
from django.utils import timezone
from datetime import timedelta
from users.models import CustomUser
from django.conf import settings
import logging

# Set up logger
logger = logging.getLogger(__name__)


class SendOTPView(APIView):
    """
    API view to send OTP to a phone number
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            
            # Generate a new OTP
            otp = PhoneOTP.generate_otp()
            
            # Create or update OTP record
            phone_otp, created = PhoneOTP.objects.update_or_create(
                phone_number=phone_number,
                defaults={
                    'otp': otp,
                    'created_at': timezone.now(),
                    'is_verified': False,
                    'attempts': 0
                }
            )
            
            # In a real production app, we would send the OTP via SMS here
            # For now, we'll just log it for testing
            logger.info(f"OTP for {phone_number}: {otp}")
            
            # In development, show the OTP in the response for testing
            # In production, you should remove this and only send via SMS
            if settings.DEBUG:
                return Response({
                    'message': 'OTP sent successfully',
                    'otp': otp,  # Only include in development
                    'expires_in': '10 minutes'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'message': 'OTP sent successfully',
                    'expires_in': '10 minutes'
                }, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(APIView):
    """
    API view to verify OTP for a phone number
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            otp = serializer.validated_data['otp']
            
            try:
                phone_otp = PhoneOTP.objects.get(phone_number=phone_number)
                
                # Validate OTP
                if phone_otp.validate_otp(otp):
                    # Check if user exists with this phone number
                    user = CustomUser.objects.filter(phone_number=phone_number).first()
                    
                    return Response({
                        'message': 'OTP verified successfully',
                        'user_exists': user is not None,
                        'phone_number': phone_number,
                        'is_verified': True
                    }, status=status.HTTP_200_OK)
                else:
                    remaining_attempts = 3 - phone_otp.attempts
                    return Response({
                        'message': 'Invalid OTP',
                        'remaining_attempts': remaining_attempts if remaining_attempts > 0 else 0
                    }, status=status.HTTP_400_BAD_REQUEST)
                    
            except PhoneOTP.DoesNotExist:
                return Response({
                    'message': 'No OTP found for this phone number'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CheckPhoneVerificationView(APIView):
    """
    API view to check if a phone number is verified
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        phone_number = request.data.get('phone_number')
        
        if not phone_number:
            return Response({
                'message': 'Phone number is required'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            phone_otp = PhoneOTP.objects.get(phone_number=phone_number)
            return Response({
                'is_verified': phone_otp.is_verified
            }, status=status.HTTP_200_OK)
        except PhoneOTP.DoesNotExist:
            return Response({
                'is_verified': False
            }, status=status.HTTP_200_OK)
