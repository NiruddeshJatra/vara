from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


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
    path('rentals/', include('rentals.urls')),
    path('reviews/', include('reviews.urls')),
    
    # Additional features
    path('complaints/', include('complaints.urls')),
    path('messages/', include('messaging.urls')),
    path('payments/', include('payments.urls')),
]

# Main URL patterns
urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # Authentication
    path('accounts/', include('allauth.urls')),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    
    # API endpoints
    path('api/', include(api_patterns)),
    
    # Default advertisement routes at root level
    path('', include('advertisements.urls')),
    
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)