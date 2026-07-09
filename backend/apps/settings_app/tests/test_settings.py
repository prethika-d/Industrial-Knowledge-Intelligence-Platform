from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class SettingsProfileTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='set@example.com', password='StrongPass123', name='Settings User',
        )
        self.client.force_authenticate(user=self.user)

    def test_get_profile(self):
        response = self.client.get(reverse('settings_app:settings_profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'set@example.com')

    def test_update_profile(self):
        response = self.client.put(
            reverse('settings_app:settings_profile'), {'facility': 'Line 5'}, format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.facility, 'Line 5')


class SettingsPreferencesTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='pref@example.com', password='StrongPass123', name='Pref User',
        )
        self.client.force_authenticate(user=self.user)

    def test_update_theme_and_notifications(self):
        response = self.client.put(
            reverse('settings_app:settings_preferences'),
            {'theme': 'light', 'notifications': {'weeklyDigest': True}},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.preferences['theme'], 'light')
        self.assertTrue(self.user.preferences['notifications']['weeklyDigest'])
        # untouched notification keys should be preserved from defaults
        self.assertTrue(self.user.preferences['notifications']['email'])
