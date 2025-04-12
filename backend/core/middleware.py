from django.http import JsonResponse
from rest_framework import status
from django.core.exceptions import ValidationError
from rest_framework.exceptions import APIException
from django.utils.translation import gettext_lazy as _

class ExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        if isinstance(exception, ValidationError):
            return JsonResponse({
                'error': _('Validation Error'),
                'detail': str(exception)
            }, status=status.HTTP_400_BAD_REQUEST)

        if isinstance(exception, APIException):
            return JsonResponse({
                'error': exception.default_detail,
                'detail': str(exception)
            }, status=exception.status_code)

        return JsonResponse({
            'error': _('Internal Server Error'),
            'detail': _('An unexpected error occurred')
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
