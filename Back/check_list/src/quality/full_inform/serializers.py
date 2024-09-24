from rest_framework import serializers

from .models import Full_inform


class Full_informSerializer(serializers.ModelSerializer):
    class Meta:
        model = Full_inform
        fields = ('quality_control_id', 'act', 'titul_list', 'well_construction', 'wellbore_sizes',
                  'chrono_data', 'sol_data', 'dash_comp', 'summary_data', 'inklino_data',
                  'main_record', 'parametr', 'control_record', 'lqc', 'calibration', 'full_inf_count')
