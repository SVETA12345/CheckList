from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField
from rest_framework.permissions import BasePermission


class User(AbstractUser):
    # class Types(models.TextChoices):
    #     enable = 'enable'
    #     blocked = 'blocked'
    #     disenable = 'disenable'
    #     None_value = ''

    # status = models.CharField(max_length=120) # choices=Types.choices
    phone_number = PhoneNumberField(blank=True, null=True)  # , blank=False, unique=True
