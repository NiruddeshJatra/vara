from django.shortcuts import render, redirect
from django.contrib.auth import logout
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter


def home(request):
  return render(request, "home.html")


def logout_view(request):
  logout(request)
  return redirect("/")
