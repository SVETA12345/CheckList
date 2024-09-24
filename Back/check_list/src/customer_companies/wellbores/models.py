from django.db import models

from ..wells.models import Well


class Wellbore(models.Model):
    class StatusTypes(models.TextChoices):
        Start = 'Должна начаться'
        Drilling = 'В бурении'
        Pending = 'В ожидании'
        Finished = 'Добурена'
        ReportSent = 'Отчет отправлен'
        Excellent_quality = 'Скважина с отличным качеством ГИС'
        Features_lithology = 'Скважина с особенностями литологии'
        Features_GIS = 'Скважина с особенностями ГИС'
        Special_GIS= 'Скважина со специальными методами ГИС'
        WITSML_accompanied = 'Скважина сопровождалась с WITSML'
        Data_problem = 'Проблема с данными'
        Missing_data = 'Отсутствие данных'
        Kdpe_problem = 'Скважина с Кдпэ <1'
        None_value = ''

    class Types(models.TextChoices):
        Horizontal = 'Горизонтальный'
        Transport = 'Транспортный'
        Pilot = 'Пилотный'
        Lateral = 'Боковой'
        None_value = ''

    class ILWD_ITypes(models.TextChoices):
        Noctidial = 'Круглосуточная'
        ForFinal = 'На финальный забой'
        None_value = ''

    class ILWD_LUTypes(models.TextChoices):
        Done = 'Выполнена'
        Not = 'Не выполнена'
        None_value = ''

    class WP_DMTypes(models.TextChoices):
        Yes = 'Да'
        No = 'Нет'
        None_value = ''

    ILWD_LU = models.CharField(max_length=120, choices=ILWD_LUTypes.choices, blank=True)
    WP_DM = models.CharField(max_length=120, choices=WP_DMTypes.choices, blank=True)
    WP_GRemark = models.TextField(blank=True, null=True)
    # ILWD_TI = models.DateTimeField(null=True, blank=True)
    # ILWD_TFS = models.DateTimeField(null=True, blank=True)
    # ILWD_TLS = models.DateTimeField(null=True, blank=True)
    # ILWD_TRS = models.DateTimeField(null=True, blank=True)
    # ILWD_TM = models.DateTimeField(null=True, blank=True)
    # ILQC_TR = models.DateTimeField(null=True, blank=True)
    ILWD_TI = models.CharField(max_length=120, blank=True, null=True)
    ILWD_TFS = models.CharField(max_length=120, blank=True, null=True)
    ILWD_TLS = models.CharField(max_length=120, blank=True, null=True)
    ILWD_TRS = models.CharField(max_length=120, blank=True, null=True)
    ILWD_TM = models.CharField(max_length=120, blank=True, null=True)
    ILQC_TR = models.CharField(max_length=120, blank=True, null=True)
    ILWD_A = models.CharField(max_length=120, blank=True, null=True)
    ILQC_A = models.CharField(max_length=120, blank=True, null=True)
    ILQC_C = models.CharField(max_length=120, blank=True, null=True)
    main_strata = models.CharField(max_length=120, blank=True, null=True)
    contractor = models.CharField(max_length=120, blank=True, null=True)
    WP_DL = models.FloatField(null=True, blank=True)
    WP_TD = models.FloatField(null=True, blank=True)
    ILWD_I = models.CharField(max_length=120, choices=ILWD_ITypes.choices, blank=True)
    status_wellbore = models.CharField(max_length=120, choices=StatusTypes.choices, blank=True)

    WP_PCS = models.FloatField(null=True, blank=True)
    WP_PT1 = models.FloatField(null=True, blank=True)
    WP_PT3 = models.FloatField(null=True, blank=True)
    WP_PWL = models.FloatField(null=True, blank=True)
    WP_PCP = models.FloatField(null=True, blank=True)
    WP_CS = models.FloatField(null=True, blank=True)
    WP_T1 = models.FloatField(null=True, blank=True)
    WP_T3 = models.FloatField(null=True, blank=True)
    WP_WL = models.FloatField(null=True, blank=True)
    WP_CP = models.FloatField(null=True, blank=True)

    num_wellbore = models.CharField(max_length=120)
    pie_well = models.CharField(max_length=120, choices=Types.choices, blank=True)
    diametr = models.FloatField(null=True, blank=True)
    time_deleted = models.DateTimeField(null=True, blank=True)

    well = models.ForeignKey(Well, related_name='well_set', on_delete=models.CASCADE)

    def __str__(self):
        return 'Ствол {}; Скв. {}'.format(self.num_wellbore, self.well)

    class Meta:
        verbose_name = 'Wellbore'
        verbose_name_plural = 'Wellbores'
        ordering = ['pie_well']
