from rest_framework import serializers
from quizapp.models import Quiz,  Question , Choices
from users.models import NewUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['id', 'user_name']



class QuizSerializer(serializers.ModelSerializer):
    quizzer = UserSerializer()
    class Meta:
        model = Quiz
        fields = ('id','title','quizzer','status','level')

# for each quiz
        
class ChoicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choices
        fields = ['id', 'answer', 'is_true']

class QuestionSerializer(serializers.ModelSerializer):
    parent_question = ChoicesSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'question', 'parent_question']

class QuizDetailsSerializer(serializers.ModelSerializer):
    parent_quiz = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = Quiz
        fields = ['id', 'title','level','status', 'parent_quiz','quizzer']

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        quizzer = NewUser.objects.get(pk=validated_data['quizzer'])
        validated_data['quizzer'] = quizzer
        validated_data['level'] = validated_data.pop('difficulty')
        quiz = Quiz.objects.create(**validated_data)

        for question_data in questions_data:
            choices_data = question_data.pop('options')
            question_data['question'] = question_data.pop("text")
            correct_option = question_data.pop('correctOption')
            question = Question.objects.create(quiz=quiz, **question_data)
            for idx,choice_data in enumerate(choices_data):
                option_data = {"answer":choice_data,'is_true':idx==correct_option}
                Choices.objects.create(question=question, **option_data)

        return quiz.title
    
    def update(self, instance:object, validated_data):
        questions_data = validated_data.pop('questions')
        instance.parent_quiz.all().delete()
        instance.title = validated_data.get('title', instance.title)
        instance.level = validated_data.get('level', instance.level)
        instance.status = validated_data.get('status', instance.level)
        instance.save()

        # Update or create questions
        for question_data in questions_data:
            choices_data = question_data.pop('options')
            question_data['question'] = question_data.pop("text")
            correct_option = question_data.pop('correctOption')
            question = Question.objects.create(quiz=instance, **question_data)
            # Update or create choices
            print(choices_data)
            for idx, choice_data in enumerate(choices_data):
                option_data = {"answer": choice_data, 'is_true': idx == correct_option}
                Choices.objects.create(question=question, **option_data)

        return instance.title

# for user own quiz
        

