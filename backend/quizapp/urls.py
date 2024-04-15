from django.urls import path
from django.views.generic import TemplateView

app_name = 'quizapp'

urlpatterns = [
    path('',TemplateView.as_view(template_name='quizapp/index.html')),
]