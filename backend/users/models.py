from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

# Create your models here.

class CustomAccountManager(BaseUserManager):
    def create_superuser(self, email, user_name, first_name, password, **other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)

        return self.create_user(email, user_name, first_name, password, **other_fields)

    
    def create_user(self, email, user_name, first_name, password, **other_fields):
        if not email:
            raise ValueError(_('Please provide an email address'))
        
        email = self.normalize_email(email)
        user = self.model(email=email,user_name=user_name,
                          first_name=first_name, **other_fields)
        
        user.set_password(password)
        user.save()
        return user
    
class NewUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('Email Address'), unique = True)
    user_name = models.CharField(max_length=150)
    first_name = models.CharField(max_length=150,blank=True)
    created_date = models.DateTimeField(default=timezone.now)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = CustomAccountManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["user_name","first_name"]

    def __str__(self) -> str:
        return self.user_name
