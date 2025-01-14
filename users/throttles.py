from rest_framework.throttling import SimpleRateThrottle

class AuthenticationThrottle(SimpleRateThrottle):
    rate = '5/minute'
    
    def get_cache_key(self, request, view):
        if not request.user.is_authenticated:
            ident = self.get_ident(request)
        else:
            ident = request.user.pk
        return f"throttle_auth_{ident}"
