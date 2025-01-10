from django.urls import path, include
from django.contrib.auth.views import LoginView, LogoutView
from allauth.account.views import SignupView
from . import views


urlpatterns = [
    path("api/social/google/", views.GoogleLogin.as_view(), name="google_login"),
    path("", views.home),
]
