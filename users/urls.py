from django.urls import path, include
from django.contrib.auth.views import LoginView, LogoutView
from allauth.account.views import SignupView

urlpatterns = [
    # Allauth's default views
    path('accounts/', include('allauth.urls')),

    # Custom login and logout views (optional, if you want to customize templates)
    path('login/', LoginView.as_view(template_name='auth/login.html'), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # Custom signup view (optional)
    path('signup/', SignupView.as_view(template_name='auth/signup.html'), name='signup'),
]