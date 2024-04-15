from django.contrib import admin
from . import models

# Register your models here.

@admin.register(models.Quiz)
class QuizzerAdmin(admin.ModelAdmin):
    list_display = ('id','title','level','quizzer')


admin.site.register(models.Question)
admin.site.register(models.Choices)