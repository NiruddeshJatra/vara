import logging
import time
from django.utils.deprecation import MiddlewareMixin

class RequestTimingLoggingMiddleware(MiddlewareMixin):
    """
    Middleware to log request path, method, status, duration, and exceptions.
    """
    def process_request(self, request):
        request._start_time = time.monotonic()
        logging.getLogger("request_timing").info(f"[START] {request.method} {request.path}")

    def process_response(self, request, response):
        start = getattr(request, '_start_time', None)
        if start is not None:
            duration = time.monotonic() - start
            logging.getLogger("request_timing").info(
                f"[END] {request.method} {request.path} {response.status_code} in {duration:.4f}s"
            )
        return response

    def process_exception(self, request, exception):
        start = getattr(request, '_start_time', None)
        duration = (time.monotonic() - start) if start else 'N/A'
        logging.getLogger("request_timing").error(
            f"[EXCEPTION] {request.method} {request.path} after {duration}s: {exception}",
            exc_info=True
        )
