from django.urls import path
from .views import QuizList, QuizDetail , UserQuizList, QuizCreate , UserQuizDetail

app_name = 'quizapp_api'

urlpatterns = [
    path('quiz/<int:pk>/',QuizDetail.as_view(),name='detailcreate'),
    path('quiz/user/<int:pk>/',UserQuizDetail.as_view(),name='userQuizdetailcreate'),
    path('quiz/create',QuizCreate.as_view(),name='quizcreate'),
    path('user',UserQuizList.as_view(),name='user-quizs'),
    path('',QuizList.as_view(), name='listcreate')
]