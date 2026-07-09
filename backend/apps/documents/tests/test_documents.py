from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.documents.models import Document

User = get_user_model()


class DocumentUploadTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='doc@example.com', password='StrongPass123', name='Doc User',
        )
        self.client.force_authenticate(user=self.user)

    def test_upload_valid_document(self):
        file_obj = SimpleUploadedFile('manual.txt', b'Sample content', content_type='text/plain')
        response = self.client.post(
            reverse('documents:document_upload'), {'file': file_obj}, format='multipart',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Document.objects.count(), 1)
        self.assertEqual(response.data['status'], 'indexed')

    def test_upload_rejects_unsupported_extension(self):
        file_obj = SimpleUploadedFile('virus.exe', b'binary', content_type='application/octet-stream')
        response = self.client.post(
            reverse('documents:document_upload'), {'file': file_obj}, format='multipart',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_upload_requires_auth(self):
        self.client.force_authenticate(user=None)
        file_obj = SimpleUploadedFile('manual.txt', b'Sample content', content_type='text/plain')
        response = self.client.post(
            reverse('documents:document_upload'), {'file': file_obj}, format='multipart',
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class DocumentListDetailTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='doc2@example.com', password='StrongPass123', name='Doc User 2',
        )
        self.other_user = User.objects.create_user(
            email='other@example.com', password='StrongPass123', name='Other User',
        )
        self.client.force_authenticate(user=self.user)
        self.doc = Document.objects.create(
            file=SimpleUploadedFile('sop.pdf', b'content'),
            filename='sop.pdf', original_name='sop.pdf', file_type='pdf',
            size=7, category='sop', uploaded_by=self.user, processing_status='indexed',
        )

    def test_list_documents(self):
        response = self.client.get(reverse('documents:document_list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)

    def test_search_documents(self):
        response = self.client.get(reverse('documents:document_list'), {'search': 'sop'})
        self.assertEqual(response.data['count'], 1)
        response = self.client.get(reverse('documents:document_list'), {'search': 'nomatch'})
        self.assertEqual(response.data['count'], 0)

    def test_retrieve_document(self):
        response = self.client.get(reverse('documents:document_detail', kwargs={'id': self.doc.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_owner_can_delete(self):
        response = self.client.delete(reverse('documents:document_detail', kwargs={'id': self.doc.id}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Document.objects.filter(id=self.doc.id).exists())

    def test_non_owner_cannot_delete(self):
        self.client.force_authenticate(user=self.other_user)
        response = self.client.delete(reverse('documents:document_detail', kwargs={'id': self.doc.id}))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
