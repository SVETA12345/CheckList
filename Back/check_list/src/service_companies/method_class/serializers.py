from rest_framework import serializers
from rest_framework.fields import ListField

from .models import Method_class

class Method_classSerializer(serializers.ModelSerializer):

    class Meta:
        model = Method_class
        fields = ('id', 'name')
