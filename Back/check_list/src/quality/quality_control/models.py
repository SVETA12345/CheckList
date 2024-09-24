from datetime import date
from django.db import models
from customer_companies.wellbores.models import Wellbore
from customer_companies.customers.models import Customer
from quality.quality_control.manager import Quality_controlManager, Types_data

from service_companies.services.models import Service


class Sample(models.Model):
    sample_file = models.FileField(upload_to="sample/%Y/%m/%d/")

    class Meta:
        db_table = 'quality_Sample'
        verbose_name = 'Шаблон'
        verbose_name_plural = 'Шаблоны'


class Quality_control(models.Model):
    """Отчёты"""
    author = models.CharField(max_length=120, null=True, blank=True, verbose_name='Автор')
    value = models.FloatField(null=True, blank=True, verbose_name='Общая оценка')
    density = models.FloatField(null=True, blank=True, verbose_name='Плотность данных')
    section_interval_start = models.FloatField(null=True, blank=True, verbose_name='Интервал секции(начало)')
    section_interval_end = models.FloatField(null=True, blank=True, verbose_name='Интервал секции(конец)')

    data_of_created = models.DateField(auto_now_add=True, verbose_name='Дата создания')
    date_of_changed = models.DateField(default=date.today, verbose_name='Дата редактирования')
    data_type = models.CharField(max_length=120, choices=Types_data.choices, verbose_name='Вид данных')
    note = models.TextField(blank=True)
    start_date = models.DateField(null=True, blank=True, verbose_name='Дата ГИС начало')
    end_date = models.DateField(null=True, blank=True, verbose_name='Дата ГИС конец')
    accompaniment_type = models.CharField(max_length=120, null=True, blank=True, choices=(('Т3', 'Т3'),
                                                                                          ('Круглосуточное','Круглосуточное')),
                                          verbose_name='Тип сопровождения')
    complex_definition = models.CharField(max_length=120, null=True, blank=True, choices=(('ГК+УЭС', 'ГК+УЭС'),
                                                                                          ('Полный', 'Полный'),
                                                                                          ('Специальный', 'Специальный'),
                                                                                          ('None', ''),),
                                          verbose_name='Автоматическое определение комплекса')
    wellbore = models.ForeignKey(Wellbore, related_name='wellbore_set', on_delete=models.CASCADE,
                                 verbose_name='Скважина')
    service_company = models.ForeignKey(Service, null=True, blank=True, on_delete=models.CASCADE,
                                        verbose_name='Сервисная компания')
    time_deleted = models.DateTimeField(null=True, blank=True)

    objects = models.Manager()
    objects_for_checks = Quality_controlManager()

    def __str__(self):
        return 'Отчёт Автор:{}; Ствол: {};'.format(self.author, self.wellbore )

    class Meta:
        db_table = 'quality_Report'
        verbose_name = 'Отчёт'
        verbose_name_plural = 'Отчёты'
        ordering = ['value']
