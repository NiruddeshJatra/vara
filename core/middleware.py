from django.http import JsonResponse
from rest_framework import status
from django.core.exceptions import ValidationError
from rest_framework.exceptions import APIException

class ExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        if isinstance(exception, ValidationError):
            return JsonResponse({
                'error': 'Validation Error',
                'detail': str(exception)
            }, status=status.HTTP_400_BAD_REQUEST)

        if isinstance(exception, APIException):
            return JsonResponse({
                'error': exception.default_detail,
                'detail': str(exception)
            }, status=exception.status_code)

        return JsonResponse({
            'error': 'Internal Server Error',
            'detail': 'An unexpected error occurred'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
