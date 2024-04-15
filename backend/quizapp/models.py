from django.db import models
from django.conf import settings
from django.db.models.query import QuerySet
from django.utils import timezone
# Create your models here.

    
class Quiz(models.Model):

    class QuizObjects(models.Manager):
        def get_queryset(self) -> QuerySet:
            return super().get_queryset().filter(status='published')
        
    class UserQuizObjects(models.Manager):
        def get_queryset(self,user_id) -> QuerySet:
            return super().get_queryset().filter(quizzer=user_id)
    
    class UserEachQuizObjects(models.Manager):
        def get_queryset(self,user_id,quiz_id) -> QuerySet:
            return super().get_queryset().filter(quizzer=user_id,id=quiz_id)

    options = (
        ('draft', 'Draft'),
        ('published', 'Published')
    )

    category_level = (
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard')
    )

    title = models.CharField(max_length=250,null=False)
    quizzed = models.DateTimeField(default=timezone.now)
    quizzer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete = models.CASCADE , related_name = 'quizzes'
    )
    status = models.CharField(max_length=10,choices=options,default='draft')
    level = models.CharField(max_length=20,choices=category_level,default='easy')

    objects = models.Manager() # default manager
    quizobjects = QuizObjects() # custom manager
    userquizobjects = UserQuizObjects() # custom  quiz for each user manager

    class Meta:
        ordering = ('-quizzed',)

    def __str__(self) -> str:
        return self.title
    
class Question(models.Model):
    quiz = models.ForeignKey(Quiz,on_delete=models.CASCADE, related_name = 'parent_quiz')

    question = models.TextField()

    REQUIRED_FIELDS = ["quiz","question"]

    def __str__(self) -> str:
        return self.question
    
class Choices(models.Model):
    question = models.ForeignKey(Question,on_delete=models.CASCADE, related_name = 'parent_question')
    answer = models.TextField()
    is_true = models.BooleanField()

    REQUIRED_FIELDS = ["question","answer"]

    def __str__(self) -> str:
        return self.answer
