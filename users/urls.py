from django.urls import path, include
from django.contrib.auth.views import LoginView, LogoutView
from allauth.account.views import SignupView
from . import views


urlpatterns = [
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('accounts/', include('allauth.urls')),
    path('api/social/google/', views.GoogleLogin.as_view(), name='google_login'),
    path('api/social/facebook/', views.FacebookLogin.as_view(), name='facebook_login'),
    path('login/', LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('signup/', SignupView.as_view(template_name='signup.html'), name='signup'),
    path('', views.home)
]