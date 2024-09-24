from rest_framework import serializers
from rest_framework.fields import ListField

from .models import Inform_for_method, Koef_fail, Koef_shod


class JSONSerializerField(serializers.Field):
    def to_internal_value(self, data):
        return data

    def to_representation(self, value):
        return value


class Inform_for_methodSerializer(serializers.ModelSerializer):
    petrophysic_selected = ListField(child=serializers.CharField())

    class Meta:
        model = Inform_for_method
        fields = ('id', 'quality_control_id', 'service_method_id', 'tool_num', 'calibr_date',
                  'interval_shod_start', 'interval_shod_end', 'reason_rashod',
                  'petrophysic_task', 'petrophysic_selected', 'method_value')


class Koef_failSerializer(serializers.ModelSerializer):
    class Meta:
        model = Koef_fail
        fields = ('koef_fail', 'inform_for_method_id')


class Koef_shodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Koef_shod
        fields = ('koef_shod', 'inform_for_method_id')
