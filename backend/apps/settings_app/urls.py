from django.urls import path

from .views import SettingsPreferencesView, SettingsProfileView

app_name = 'settings_app'

urlpatterns = [
    path('profile/', SettingsProfileView.as_view(), name='settings_profile'),
    path('preferences/', SettingsPreferencesView.as_view(), name='settings_preferences'),
]
