from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


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
    
    # Authentication
    path('accounts/', include('allauth.urls')),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path("auth/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    
    # API endpoints
    path('api/', include(api_patterns)),
    
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)