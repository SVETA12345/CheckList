from rest_framework import serializers

from .models import Well


class WellSerializer(serializers.ModelSerializer):
    # well_type = serializers.SerializerMethodField()

    class Meta:
        model = Well
        fields = ('id', 'num_well', 'num_pad',
                  'well_type', 'cluster_id')
