from django.test import TestCase
from django.contrib.auth.models import User
from quizapp.models import Quiz, Category

# Create your tests here.

class Test_Create_Quiz(TestCase):
    @classmethod
    def createTestData(cls):
        test_category = Category.objects.create(name='Test Category')
        test_user = User.objects.create_user(
            username='Test User 1',
            password='test_user_1'
        )
        test_quiz = Quiz.objects.create(
            title = 'Test Title',
            category_id = 1,
            quizzer_id = 1,
            question = 'Test Question',
            status = 'draft'
        )

    def test_quiz_datas(self):
        print(Quiz.objects.get(id=2))
        quiz = Quiz.quizobjects.get(id=2)
        cat = Category.objects.get(id=1)
        print(quiz)
        print(cat)
        self.assertEqual(str(Quiz),'Test Title') 
        self.assertEqual(str(Category),'Test Category')         
        self.assertEqual(quiz.title,'Test Title')
        self.assertEqual(quiz.question,'Test Question')
        self.assertEqual(quiz.status,'draft')