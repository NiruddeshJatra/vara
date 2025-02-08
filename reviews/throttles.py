from rest_framework.throttling import UserRateThrottle

# Throttle class to limit the number of review list requests.
class ReviewListThrottle(UserRateThrottle):
    rate = '100/hour'  # Allow 100 requests per hour per user
