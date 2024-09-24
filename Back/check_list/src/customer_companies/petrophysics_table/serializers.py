from rest_framework import serializers

from .models import Petrophysics_table


class Petrophysics_tableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Petrophysics_table
        fields = ('id', 'field_id', 'method_id', 'separation_of_reservoirs', 'determination_nature_saturation',
                  'determination_Kp', 'determination_Kng', 'determination_lithotype')