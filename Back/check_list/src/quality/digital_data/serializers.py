from rest_framework import serializers

from .models import Digital_data


class Digital_dataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Digital_data
        fields = "__all__"
        
