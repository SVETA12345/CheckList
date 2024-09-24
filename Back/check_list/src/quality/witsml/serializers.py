from rest_framework import serializers

from .models import Witsml


class WitsmlSerializer(serializers.ModelSerializer):
    class Meta:
        model = Witsml
        fields = ('quality_control_id', 'curvenames', 'mnemodescription', 'fullness_data', 'witsml_count', 'status')
