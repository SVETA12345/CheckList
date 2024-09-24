from rest_framework import serializers

from .models import Method


class MethodSerializer(serializers.ModelSerializer):
    # method_class_id = serializers.CharField(max_length=100, read_only=False, allow_null=True, allow_blank=True, required=False)

    class Meta:
        model = Method
        fields = ('id', 'name', 'method_class_id')
