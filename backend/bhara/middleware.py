import logging
import time
from django.utils.deprecation import MiddlewareMixin
import redis
from django.conf import settings

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


class RedisConnectionManagementMiddleware(MiddlewareMixin):
    """
    Middleware to manage Redis connections efficiently across requests.
    
    This middleware ensures Redis connections are properly handled during
    the request/response cycle, preventing connection pool exhaustion and
    addressing common Redis connection warnings.
    """
    logger = logging.getLogger("redis_connections")
    _redis_pool = None
    
    @classmethod
    def get_redis_pool(cls):
        """Get or create a Redis connection pool (singleton pattern)."""
        if cls._redis_pool is None:
            try:
                # Get Redis URL from settings, with fallback to a default
                redis_url = getattr(settings, 'REDIS_URL', None)
                if not redis_url:
                    redis_url = getattr(settings, 'CELERY_BROKER_URL', 'redis://localhost:6379/0')
                
                # Create connection pool with proper configuration
                cls._redis_pool = redis.ConnectionPool.from_url(
                    url=redis_url,
                    max_connections=30,  # Limiting max connections
                    socket_timeout=5,    # 5 seconds timeout
                    socket_connect_timeout=5,
                    retry_on_timeout=True
                )
                cls.logger.info(f"Redis connection pool created with {redis_url}")
            except Exception as e:
                cls.logger.error(f"Error creating Redis connection pool: {str(e)}")
                return None
        return cls._redis_pool
    
    def process_request(self, request):
        """Ensure the Redis pool is ready at the start of each request."""
        pool = self.get_redis_pool()
        if pool:
            # Store the pool on the request object for later use
            request._redis_pool = pool
    
    def process_response(self, request, response):
        """Clean up Redis resources if necessary."""
        # Nothing to clean up since connections return to the pool automatically
        return response
    
    def process_exception(self, request, exception):
        """Log Redis-related exceptions."""
        if isinstance(exception, redis.RedisError):
            self.logger.error(f"Redis error during request: {str(exception)}")
            # Don't return anything to let the exception propagate
