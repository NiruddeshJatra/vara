"""
Redis connection utilities to ensure proper connection pooling and reuse.
This helps prevent connection warnings and improves performance.
"""
from django_redis import get_redis_connection
from django.core.cache import cache
import logging
import redis
from bhara.middleware import RedisConnectionManagementMiddleware

logger = logging.getLogger(__name__)

def get_redis_client():
    """
    Returns a reusable Redis client using the application's connection pool.
    Always use this instead of creating new Redis connections.
    
    Usage:
        from bhara.redis_utils import get_redis_client
        
        redis_client = get_redis_client()
        redis_client.set('key', 'value')
        value = redis_client.get('key')
    """
    try:
        # Try to get Redis connection from django-redis first
        try:
            return get_redis_connection("default")
        except Exception:
            # Fallback to our middleware's connection pool
            pool = RedisConnectionManagementMiddleware.get_redis_pool()
            if pool:
                return redis.Redis(connection_pool=pool)
            else:
                raise Exception("Redis connection pool not available")
    except Exception as e:
        logger.error(f"Failed to get Redis connection: {e}")
        # Return None so caller can handle gracefully
        return None

def cache_data(key, data, timeout=3600):
    """
    Cache data with proper error handling.
    
    Args:
        key (str): Cache key
        data (any): Data to cache
        timeout (int): Cache timeout in seconds (default: 1 hour)
    
    Returns:
        bool: True if caching was successful, False otherwise
    """
    try:
        cache.set(key, data, timeout=timeout)
        return True
    except Exception as e:
        logger.error(f"Failed to cache data for key {key}: {e}")
        return False

def get_cached_data(key, default=None):
    """
    Get cached data with proper error handling.
    
    Args:
        key (str): Cache key
        default: Default value to return if key not found or error
        
    Returns:
        The cached data or default value
    """
    try:
        return cache.get(key, default)
    except Exception as e:
        logger.error(f"Failed to get cached data for key {key}: {e}")
        return default
