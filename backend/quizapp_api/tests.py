from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from quizapp.models import Quiz, Category
from django.contrib.auth.models import User

# Create your tests here.
class QuizTest(APITestCase):

    def test_view_quizzed(self):
        url = reverse('quizapp_api:listcreate')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def create_quiz(self):
        self.test_category = Category.objects.create(name='Travel')
        self.test_user_1 = User.objects.create_user(
            username='Test User 1',
            password='test_user_1'
        )

        data = {
            "title": "Test",
            "author":1,
            "question":"Test Question",
            }
        
        url = reverse('quizapp_api:listcreate')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)