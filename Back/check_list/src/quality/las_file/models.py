from django.db import models
from django.utils.translation import gettext_lazy as _

# скрипт !
from quality.quality_control.models import Quality_control


class Las_file(models.Model):
    class Types(models.TextChoices):
        Full = 'Полная'
        Partial = 'Частичная'
        Absent = 'Отсутствует'
        None_value = ''

    quality_control = models.OneToOneField(Quality_control, related_name='las_file_set', on_delete=models.CASCADE,
                                           primary_key=True)
    cap = models.CharField(max_length=120, choices=Types.choices, blank=True)
    parametres = models.CharField(max_length=120, choices=Types.choices, blank=True)
    mnemodescription = models.CharField(max_length=120, choices=Types.choices, blank=True)
    tabledata = models.CharField(max_length=120, choices=Types.choices, blank=True)
    las_file_count = models.FloatField(null=True, blank=True)

    status = models.BooleanField(blank=True, null=True, default=True)

    class Meta:
        verbose_name = 'File'
        verbose_name_plural = 'Files'
        # ordering = ['name']
