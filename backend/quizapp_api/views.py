from rest_framework import generics , status
from rest_framework.response import Response
from quizapp.models import Quiz
from .serializers import QuizSerializer, QuizDetailsSerializer
from rest_framework.permissions import IsAdminUser, DjangoModelPermissionsOrAnonReadOnly, DjangoModelPermissions , AllowAny , IsAuthenticated
from rest_framework.exceptions import MethodNotAllowed
from rest_framework_simplejwt.tokens import AccessToken
from django.shortcuts import get_object_or_404

# Create your views here.

def get_user_id_from_jwt_token(request):
    # Get the authorization header from the request
    authorization_header = request.headers.get('Authorization', '')
    
    # Extract the token from the authorization header
    try:
        token = authorization_header.split()[1]
    except IndexError:
        return None

    # Decode the token and retrieve the user ID
    try:
        decoded_token = AccessToken(token)
        user_id = decoded_token['user_id']
        return user_id
    except Exception as e:
        # Handle token decoding errors
        print(f"Token decoding error: {e}")
        return None

class QuizList(generics.ListCreateAPIView):
    # permission_classes = [IsAdminUser]
    # permission_classes = [ DjangoModelPermissions]
    queryset = Quiz.quizobjects.all()
    serializer_class = QuizSerializer


class QuizDetail(generics.RetrieveDestroyAPIView):
    queryset = Quiz.quizobjects.all()
    serializer_class = QuizDetailsSerializer

class QuizCreate(generics.CreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizDetailsSerializer    

class UserQuizDetail(generics.RetrieveUpdateDestroyAPIView, generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuizDetailsSerializer

    def post(self, request, *args, **kwargs):
        user_id = get_user_id_from_jwt_token(request)
        if user_id is not None:
            request.data["quizzer"] = user_id
            print(request.data)
            serializer = self.get_serializer(data=request.data)

            if serializer.is_valid():
                serializer.create(request.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'statusText': 'Authentication is required in the request'}, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request, *args, **kwargs):
        print(request)
        user_id = get_user_id_from_jwt_token(request)
        quiz_id = self.kwargs.get('pk')  
        if user_id is not None and quiz_id is not None:
            # Retrieve quizzes for the specified user_id
            queryset = get_object_or_404(Quiz,quizzer=user_id,id=quiz_id)
            serializer = self.get_serializer(queryset)
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'statusText': 'Authentication & Quiz Id is required in the POST data'}, status=status.HTTP_400_BAD_REQUEST)
   
    def delete(self, request, *args, **kwargs):
        print(request)
        user_id = get_user_id_from_jwt_token(request)
        quiz_id = self.kwargs.get('pk') 
        if user_id is not None and quiz_id is not None:
            queryset = get_object_or_404(Quiz, quizzer = user_id,id=quiz_id)
            queryset.delete()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response({"statusText":'Authentication & Quiz Id is required in the POST data'}, status=status.HTTP_400_BAD_REQUEST)
        
    def put(self, request, *args, **kwargs):
        print(request)
        user_id = get_user_id_from_jwt_token(request)
        quiz_id = self.kwargs.get('pk')
        if user_id is not None and quiz_id is not None:
            queryset = get_object_or_404(Quiz, quizzer = user_id, id = quiz_id)
            request.data["quizzer"] = user_id
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.update(queryset,request.data)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"statusText":'Authentication & Quiz Id is required in the POST data'}, status=status.HTTP_400_BAD_REQUEST)        
            



class UserQuizList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuizSerializer

    def post(self, request, *args, **kwargs):
        user_id = get_user_id_from_jwt_token(request)
        if user_id is not None:
            queryset = Quiz.userquizobjects.get_queryset(user_id)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'user_id is required in the POST data'}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        # Raise MethodNotAllowed for GET requests
        return Response({'error': 'Only Post Method is allowed..'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

# class UserQuizList(generics.ListCreateAPIView):

#     def post(self, request, format='json'):
#         print(request.data)   
#         queryset = Quiz.userquizobjects.get_queryset(1)
#         serializer_class = QuizSerializer
#         return Response(queryset, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

        # print(request)
        # user_id = get_user_id_from_jwt_token(request)
        # quiz_id = self.kwargs.get('pk')  
        # if user_id is not None and quiz_id is not None:
        #     # Retrieve quizzes for the specified user_id
        #     queryset = get_object_or_404(Quiz,quizzer=user_id,id=quiz_id)
        #     serializer = self.get_serializer(queryset)
        #     return Response(serializer.data, status=status.HTTP_200_OK)
        # else:
        #     return Response({'error': 'Authentication & Quiz Id is required in the POST data'}, status=status.HTTP_400_BAD_REQUEST)    
