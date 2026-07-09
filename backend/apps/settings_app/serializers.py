from rest_framework import serializers

from apps.accounts.models import User


class SettingsProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role', 'facility', 'avatar']
        read_only_fields = ['id', 'role']


class NotificationPreferencesSerializer(serializers.Serializer):
    email = serializers.BooleanField(default=True)
    reportReady = serializers.BooleanField(default=True)
    weeklyDigest = serializers.BooleanField(default=False)


class PreferencesSerializer(serializers.Serializer):
    theme = serializers.ChoiceField(choices=['dark', 'light'], required=False)
    notifications = NotificationPreferencesSerializer(required=False)
