from rest_framework import serializers
from rest_framework.fields import ListField

from .models import Method_parametrs, Mnemonic


class JSONSerializerField(serializers.Field):
    def to_internal_value(self, data):
        return data

    def to_representation(self, value):
        return value


class Method_parametrsSerializer(serializers.ModelSerializer):
    units = ListField(child=serializers.CharField())

    class Meta:
        model = Method_parametrs
        fields = ('id', 'method_id', 'name', 'abbreviation', 'curve_type', 'units', 'description')


class MnemonicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Mnemonic
        fields = ('id', 'method_parametr_id', 'name')
