from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'phone_number',
                  'is_active', 'is_staff', 'is_superuser', 'groups', 'last_login', 'date_joined',)
