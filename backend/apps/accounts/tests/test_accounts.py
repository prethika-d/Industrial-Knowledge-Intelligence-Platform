from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class RegisterTests(APITestCase):
    def test_register_creates_user(self):
        url = reverse('accounts:register')
        payload = {
            'name': 'Jane Doe',
            'email': 'jane@example.com',
            'password': 'StrongPass123',
            'password_confirm': 'StrongPass123',
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email='jane@example.com').exists())

    def test_register_password_mismatch_fails(self):
        url = reverse('accounts:register')
        payload = {
            'name': 'Jane Doe',
            'email': 'jane2@example.com',
            'password': 'StrongPass123',
            'password_confirm': 'Mismatch123',
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='login@example.com', password='StrongPass123', name='Login User',
        )

    def test_login_returns_tokens_and_user(self):
        url = reverse('accounts:login')
        response = self.client.post(
            url, {'email': 'login@example.com', 'password': 'StrongPass123'}, format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['email'], 'login@example.com')

    def test_login_invalid_credentials(self):
        url = reverse('accounts:login')
        response = self.client.post(
            url, {'email': 'login@example.com', 'password': 'WrongPass'}, format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProfileTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='profile@example.com', password='StrongPass123', name='Profile User',
        )
        self.client.force_authenticate(user=self.user)

    def test_get_profile(self):
        response = self.client.get(reverse('accounts:profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'profile@example.com')

    def test_update_profile(self):
        response = self.client.put(
            reverse('accounts:profile'), {'name': 'Updated Name'}, format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.name, 'Updated Name')

    def test_profile_requires_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('accounts:profile'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ChangePasswordTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='pwd@example.com', password='OldPass123', name='Pwd User',
        )
        self.client.force_authenticate(user=self.user)

    def test_change_password_success(self):
        response = self.client.put(
            reverse('accounts:change_password'),
            {
                'old_password': 'OldPass123',
                'new_password': 'NewPass456',
                'new_password_confirm': 'NewPass456',
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NewPass456'))

    def test_change_password_wrong_old_password(self):
        response = self.client.put(
            reverse('accounts:change_password'),
            {
                'old_password': 'WrongOld',
                'new_password': 'NewPass456',
                'new_password_confirm': 'NewPass456',
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
