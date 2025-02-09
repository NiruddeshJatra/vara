from rest_framework.throttling import UserRateThrottle

# Throttle class to limit the number of review list requests.
class ReviewListThrottle(UserRateThrottle):
    rate = '100/hour'  # Allow 100 requests per hour per user


class ReviewCreateThrottle(UserRateThrottle):
    rate = '5/hour'  # Allow 5 reviews per hour per user