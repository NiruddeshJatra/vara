from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from users.views import CustomLoginView, ResendVerificationEmailView, VerifyEmailView, CustomRegisterView

schema_view = get_schema_view(
    openapi.Info(
        title="Vhara API",
        default_version="v1",
        description="API documentation for Vhara",
    ),
    public=True,
)

# API URL patterns
api_patterns = [
    # User management
    path('users/', include('users.urls')),
    
    # Core functionality
    path('advertisements/', include('advertisements.urls')),
    path('rentals/', include('rentals.urls')),
    path('reviews/', include('reviews.urls')),
    
    # Additional features
    path('complaints/', include('complaints.urls')),
    path('messages/', include('messaging.urls')),
]

# Main URL patterns
urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # Authentication - only include non-registration endpoints from dj-rest-auth
    path('auth/password/', include('dj_rest_auth.urls')),  # Only include password-related endpoints
    
    # Custom authentication endpoints
    path("auth/login/", CustomLoginView.as_view(), name="custom_login"),
    path("auth/registration/", CustomRegisterView.as_view(), name="custom_register"),
    path(
        "auth/resend-verification/",
        ResendVerificationEmailView.as_view(),
        name="resend_verification",
    ),
    path(
        "auth/verify-email/<str:token>/",
        VerifyEmailView.as_view(),
        name="verify_email",
    ),
    
    # API endpoints
    path('api/', include(api_patterns)),
    
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)