from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.assistant.models import AIConversation

User = get_user_model()


class AIQueryTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='ai@example.com', password='StrongPass123', name='AI User',
        )
        self.client.force_authenticate(user=self.user)

    def test_query_creates_conversation(self):
        response = self.client.post(
            reverse('assistant:ai_query'), {'query': 'What is the torque spec?'}, format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(AIConversation.objects.count(), 1)
        self.assertIn('sources', response.data)
        self.assertEqual(response.data['role'], 'assistant')

    def test_query_requires_nonblank_text(self):
        response = self.client.post(reverse('assistant:ai_query'), {'query': ''}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_query_requires_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(reverse('assistant:ai_query'), {'query': 'Hello'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AIHistoryTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='hist@example.com', password='StrongPass123', name='Hist User',
        )
        self.other_user = User.objects.create_user(
            email='hist2@example.com', password='StrongPass123', name='Hist User 2',
        )
        self.client.force_authenticate(user=self.user)
        self.convo = AIConversation.objects.create(
            user=self.user, query='Q1', response='R1', sources=['doc.pdf'],
        )
        AIConversation.objects.create(
            user=self.other_user, query='Q2', response='R2', sources=[],
        )

    def test_history_only_returns_own_conversations(self):
        response = self.client.get(reverse('assistant:ai_history'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)

    def test_delete_history_entry(self):
        response = self.client.delete(reverse('assistant:ai_history_delete', kwargs={'id': self.convo.id}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(AIConversation.objects.filter(id=self.convo.id).exists())
