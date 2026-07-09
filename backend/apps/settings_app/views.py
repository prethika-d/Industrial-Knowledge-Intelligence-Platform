from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import PreferencesSerializer, SettingsProfileSerializer


@extend_schema(tags=['Settings'])
class SettingsProfileView(APIView):
    """GET/PUT /api/settings/profile/ — profile fields shown on the Settings page."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(SettingsProfileSerializer(request.user).data)

    def put(self, request):
        serializer = SettingsProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


@extend_schema(tags=['Settings'])
class SettingsPreferencesView(APIView):
    """PUT /api/settings/preferences/ — theme & notification toggles."""

    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = PreferencesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        prefs = user.preferences or user.default_preferences()

        if 'theme' in serializer.validated_data:
            prefs['theme'] = serializer.validated_data['theme']
        if 'notifications' in serializer.validated_data:
            prefs.setdefault('notifications', {})
            prefs['notifications'].update(serializer.validated_data['notifications'])

        user.preferences = prefs
        user.save(update_fields=['preferences', 'updated_at'])
        return Response({'preferences': user.preferences})
