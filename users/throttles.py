# Module: throttles - Implements custom rate throttling for authentication.

from rest_framework.throttling import SimpleRateThrottle, AnonRateThrottle, UserRateThrottle

class AuthenticationThrottle(AnonRateThrottle):
    # Limit each user to 5 requests per minute for authentication endpoints.
    rate = '5/minute'
    
    def get_cache_key(self, request, view):
        # Use user ID if authenticated, else fallback to IP identifier.
        if not request.user.is_authenticated:
            ident = self.get_ident(request)
        else:
            ident = request.user.pk
        return f"throttle_auth_{ident}"

class UserProfileThrottle(UserRateThrottle):
    rate = '10/minute'
