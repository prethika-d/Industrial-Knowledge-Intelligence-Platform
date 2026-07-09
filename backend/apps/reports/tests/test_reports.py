from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.reports.models import Report

User = get_user_model()


class ReportGenerateTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='rpt@example.com', password='StrongPass123', name='Report User',
        )
        self.client.force_authenticate(user=self.user)

    def test_generate_report_creates_pdf(self):
        response = self.client.post(
            reverse('reports:report_generate'),
            {'title': 'Test Report', 'report_type': 'Maintenance'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'ready')
        self.assertTrue(response.data['id'].startswith('RPT-'))
        self.assertIsNotNone(response.data['download_url'])

    def test_generate_report_requires_valid_type(self):
        response = self.client.post(
            reverse('reports:report_generate'),
            {'title': 'Bad Report', 'report_type': 'NotAType'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ReportListDetailDownloadTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='rpt2@example.com', password='StrongPass123', name='Report User 2',
        )
        self.client.force_authenticate(user=self.user)
        create_resp = self.client.post(
            reverse('reports:report_generate'),
            {'title': 'Ready Report', 'report_type': 'Safety'},
            format='json',
        )
        self.reference = create_resp.data['id']

    def test_list_reports(self):
        response = self.client.get(reverse('reports:report_list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)

    def test_filter_by_status(self):
        response = self.client.get(reverse('reports:report_list'), {'status': 'ready'})
        self.assertEqual(response.data['count'], 1)
        response = self.client.get(reverse('reports:report_list'), {'status': 'failed'})
        self.assertEqual(response.data['count'], 0)

    def test_retrieve_report(self):
        response = self.client.get(
            reverse('reports:report_detail', kwargs={'reference': self.reference})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_download_ready_report(self):
        response = self.client.get(
            reverse('reports:report_download', kwargs={'reference': self.reference})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')

    def test_download_not_ready_report_returns_conflict(self):
        report = Report.objects.create(
            title='Pending', report_type='Engineering', generated_by=self.user, status='processing',
        )
        response = self.client.get(
            reverse('reports:report_download', kwargs={'reference': report.reference})
        )
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_delete_report(self):
        response = self.client.delete(
            reverse('reports:report_detail', kwargs={'reference': self.reference})
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
