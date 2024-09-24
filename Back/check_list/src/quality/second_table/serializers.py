from rest_framework import serializers

from .models import Second_table


class Second_tableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Second_table
        fields = ('inform_for_method_id', 'linkage', 'emissions', 'noise', 'control',
                  'distribute_support', 'distribute_palet', 'dash', 'corresponse', 'correlation', 'notes',
                  'device_tech_condition')
