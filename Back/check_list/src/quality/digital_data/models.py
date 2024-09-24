from django.db import models
from django.utils.translation import gettext_lazy as _

from quality.quality_control.models import Quality_control


class Digital_data(models.Model):

    quality_control = models.OneToOneField(Quality_control, related_name='digital_data_set', on_delete=models.CASCADE,
                                           primary_key=True)
    wellLas = models.CharField(max_length=120, blank=True, null=True)
    parameteresLas = models.CharField(max_length=120, blank=True, null=True)
    curveLas = models.CharField(max_length=120, blank=True, null=True)
    log_dataLas = models.CharField(max_length=120, blank=True, null=True)
    wellWitsml = models.CharField(max_length=120, blank=True, null=True)
    parameteresWitsml = models.CharField(max_length=120, blank=True, null=True)
    curveWitsml = models.CharField(max_length=120, blank=True, null=True)
    log_dataWitsml = models.CharField(max_length=120, blank=True, null=True)
    digital_count = models.FloatField(null=True, blank=True)
    type = models.CharField(max_length=120, blank=True)

    def __str__(self):
        return 'Данные для отчёта - {}'.format(self.quality_control)

    class Meta:
        db_table = 'quality_DigitalData'
        verbose_name = 'Данные'
        verbose_name_plural = 'Цифровые данные для отчёта'

