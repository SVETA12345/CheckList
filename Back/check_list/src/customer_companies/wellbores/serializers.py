from rest_framework import serializers
from .models import Wellbore


class WellboreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wellbore
        fields = ('id', 'num_wellbore', 'pie_well', 'diametr', 'well_id', 'main_strata', 'contractor',
                  'ILWD_LU', 'WP_DM', 'WP_GRemark', 'ILWD_TI', 'ILWD_TFS', 'ILWD_TLS', 'ILWD_TRS', 'ILWD_TM',
                  'ILQC_TR', 'ILWD_A', 'ILQC_A', 'ILQC_C', 'WP_DL', 'WP_TD', 'ILWD_I', 'status_wellbore', 'WP_PCS',
                  'WP_PT1', 'WP_PT3', 'WP_PWL', 'WP_PCP', 'WP_CS', 'WP_T1', 'WP_T3', 'WP_WL', 'WP_CP')
