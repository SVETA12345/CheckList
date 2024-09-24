from rest_framework import serializers

from .models import Strata


class StrataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Strata
        strata_file = serializers.FileField(allow_empty_file=True)
        fields = ('id', 'name', 'field_id', 'strata_file', 'strata_file_name')