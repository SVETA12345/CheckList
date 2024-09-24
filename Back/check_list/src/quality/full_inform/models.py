from django.db import models
from django.utils.translation import gettext_lazy as _

from quality.quality_control.models import Quality_control


class Full_inform(models.Model):
    class Act(models.TextChoices):
        true = 'Имеется'
        false = 'Не имеется'
        None_value = ''

    class Types(models.TextChoices):
        Full = 'Полная'
        Partial = 'Частичная'
        Absent = 'Отсутствует'
        None_value = ''

    quality_control = models.OneToOneField(Quality_control, related_name='full_inform_set', on_delete=models.CASCADE,
                                           primary_key=True)
    act = models.CharField(max_length=120, choices=Act.choices, blank=True)
    titul_list = models.CharField(max_length=120, choices=Types.choices, blank=True)
    well_construction = models.CharField(max_length=120, choices=Act.choices, blank=True)
    wellbore_sizes = models.CharField(max_length=120, choices=Types.choices, blank=True)
    chrono_data = models.CharField(max_length=120, choices=Act.choices, blank=True)
    sol_data = models.CharField(max_length=120, choices=Types.choices, blank=True)
    dash_comp = models.CharField(max_length=120, choices=Types.choices, blank=True)
    summary_data = models.CharField(max_length=120, choices=Act.choices, blank=True)
    inklino_data = models.CharField(max_length=120, choices=Act.choices, blank=True)
    main_record = models.CharField(max_length=120, choices=Types.choices, blank=True)
    parametr = models.CharField(max_length=120, choices=Act.choices, blank=True)
    control_record = models.CharField(max_length=120, choices=Act.choices, blank=True)
    lqc = models.CharField(max_length=120, choices=Act.choices, blank=True)
    calibration = models.CharField(max_length=120, choices=Types.choices, blank=True)
    full_inf_count = models.FloatField(null=True, blank=True)

    class Meta:
        verbose_name = 'Полнота представления данных'
        verbose_name_plural = 'Полнота представления данных'
        