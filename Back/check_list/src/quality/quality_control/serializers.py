from rest_framework import serializers

from .models import Quality_control, Sample


class SampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sample
        sample_file = serializers.FileField(allow_empty_file=True)
        fields = ('id', 'sample_file',)


class Quality_controlSerializer(serializers.ModelSerializer):
    quality_control_id = serializers.ReadOnlyField(source='id')

    class Meta:
        model = Quality_control
        exclude = ('id',)
        
