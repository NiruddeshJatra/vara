# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from . import views
# from rest_framework.throttling import UserRateThrottle

# class PaymentListThrottle(UserRateThrottle):
#     rate = '100/hour'
    
    
# router = DefaultRouter()
# router.register(r'payments', views.PaymentViewSet, basename='payment')

# urlpatterns = [
#     path('', include(router.urls)),
#     path('payment-success/', views.payment_success, name='payment-success'),
#     path('payment-fail/', views.payment_fail, name='payment-fail'),
#     path('payment-cancel/', views.payment_fail, name='payment-cancel'),
# ]