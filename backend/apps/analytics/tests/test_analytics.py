from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.analytics.models import Analytics

User = get_user_model()


class AnalyticsOverviewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='an@example.com', password='StrongPass123', name='Analytics User',
        )
        self.client.force_authenticate(user=self.user)
        Analytics.objects.create(metric_name='query_accuracy', value=94.2, unit='%', period='current')

    def test_overview_returns_four_cards(self):
        response = self.client.get(reverse('analytics:analytics_overview'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['metrics']), 4)

    def test_overview_requires_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('analytics:analytics_overview'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AnalyticsUsageTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='an2@example.com', password='StrongPass123', name='Analytics User 2',
        )
        self.client.force_authenticate(user=self.user)
        Analytics.objects.create(metric_name='department_usage', dimension='Maintenance', value=3000, period='current')
        Analytics.objects.create(metric_name='department_usage', dimension='Safety', value=1200, period='current')

    def test_usage_sorted_descending(self):
        response = self.client.get(reverse('analytics:analytics_usage'))
        data = response.data['usage_by_department']
        self.assertEqual(data[0]['dept'], 'Maintenance')
        self.assertEqual(data[0]['value'], 3000)


class AnalyticsChartsTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='an3@example.com', password='StrongPass123', name='Analytics User 3',
        )
        self.client.force_authenticate(user=self.user)
        Analytics.objects.create(metric_name='queries', period='Jan', value=100)
        Analytics.objects.create(metric_name='uploads', period='Jan', value=20)

    def test_charts_growth_shape(self):
        response = self.client.get(reverse('analytics:analytics_charts'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        point = response.data['growth'][0]
        self.assertEqual(point['month'], 'Jan')
        self.assertEqual(point['queries'], 100)
        self.assertEqual(point['uploads'], 20)
