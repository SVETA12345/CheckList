from django.db import models
from django.utils.translation import gettext_lazy as _

from quality.quality_control.models import Quality_control


class Witsml(models.Model):
    class Types(models.TextChoices):
        Full = 'Полная'
        Partial = 'Частичная'
        Absent = 'Отсутствует'
        None_value = ''

    quality_control = models.OneToOneField(Quality_control, related_name='witsml_set', on_delete=models.CASCADE,
                                           primary_key=True)
    curvenames = models.CharField(max_length=120, choices=Types.choices, blank=True)
    mnemodescription = models.CharField(max_length=120, choices=Types.choices, blank=True)
    fullness_data = models.CharField(max_length=120, choices=Types.choices, blank=True)
    witsml_count = models.FloatField(null=True, blank=True)

    status = models.BooleanField(blank=True, null=True, default=True)