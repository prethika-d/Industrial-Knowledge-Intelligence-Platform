from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.dashboard.models import Activity, SystemStatus

User = get_user_model()


class DashboardStatsTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='dash@example.com', password='StrongPass123', name='Dash User',
        )
        self.client.force_authenticate(user=self.user)

    def test_stats_returns_cards(self):
        response = self.client.get(reverse('dashboard:dashboard_stats'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['stats']), 4)
        self.assertIn('system_health', response.data)

    def test_stats_requires_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('dashboard:dashboard_stats'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class SystemStatusTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='sys@example.com', password='StrongPass123', name='Sys User',
        )
        self.client.force_authenticate(user=self.user)
        SystemStatus.objects.create(service_name='AI Engine', status='Operational', latency_ms=100)

    def test_system_status_list(self):
        response = self.client.get(reverse('dashboard:system_status'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['systems']), 1)
        self.assertEqual(response.data['systems'][0]['latency'], '100ms')


class ActivityFeedTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='act@example.com', password='StrongPass123', name='Act User',
        )
        self.client.force_authenticate(user=self.user)
        Activity.objects.create(action='upload', text='Uploaded a file', user=self.user)

    def test_activity_feed_list(self):
        response = self.client.get(reverse('dashboard:activity_feed'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['activity']), 1)
        self.assertIn('time', response.data['activity'][0])
        self.assertIn('icon', response.data['activity'][0])
