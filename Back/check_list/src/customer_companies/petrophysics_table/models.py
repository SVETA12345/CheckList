from django.db import models

from service_companies.methods.models import Method
from ..fields.models import Field

PETR_DEFAULT = {"Азимутальный имидж гамма-каротаж": [0.35, None, None, None, 0.1],
                "Азимутальный имидж индекса фотоэлектрического фактора": [0.35, None, None, None, 0.1],
                "Азимутальный имидж объемной плотности": [0.35, None, None, None, 0.1],
                "Азимутальный электрический микроимиджер": [0.35, None, 0.2, None, 0.1],
                "Акустический каротаж на преломленных волнах": [0.35, None, 0.2, None, 0.1],
                "Акустический каротаж на отраженных волнах": [0.35, None, 0.2, None, 0.1],
                "Гамма-гамма каротаж (Индекс фотоэлектрического поглощения)": [None, None, None, None, 0.1],
                "Гамма-гамма каротаж (Объемная плотность)": [0.35, 0.25, 0.2, None, 0.1],
                "Нейтрон-нейтронный каротаж": [0.35, 0.25, 0.2, None, 0.1],
                "Импульсный нейтрон-нейтронный каротаж": [0.35, 0.25, 0.2, 0.1, 0.1],
                "Импульсный спектрометрический нейтронный гамма-каротаж": [0.35, None, None, None, 0.1],
                "Интегральный гамма-каротаж": [0.35, None, None, None, 0.1],
                "Спектрометрический гамма-каротаж": [0.35, None, None, None, 0.1],
                'Индукционный каротаж': [None, 0.25, None, 0.1, 0.1],
                "Боковой каротаж": [None, 0.25, None, 0.1, 0.1],
                "Боковой микрокаротаж": [0.35, None, None, None, 0.1],
                "Высокочастотное индукционное каротажное изопараметрическое зондирование": [None, 0.25, None, 0.1, 0.1],
                "Электромагнитный каротаж по затуханию": [None, 0.25, None, 0.1, 0.1],
                "Акустический каверномер": [None, None, None, None, 0.1],
                "Каверномер": [0.35, None, None, None, None],
                "Плотностной каверномер": [None, None, None, None, 0.1],
                "Ядерно-магнитный каротаж в сильном поле": [0.35, 0.25, 0.2, None, 0.1], }


class Petrophysics_table(models.Model):
    # name = models.CharField(max_length=120, unique=True)
    field = models.ForeignKey(Field, related_name='field_petrophysics_set', on_delete=models.CASCADE)
    method = models.ForeignKey(Method, related_name='method_petrophysics_set', on_delete=models.CASCADE)
    time_deleted = models.DateTimeField(null=True, blank=True)

    separation_of_reservoirs = models.FloatField(null=True, blank=True)
    determination_nature_saturation = models.FloatField(null=True, blank=True)
    determination_Kp = models.FloatField(null=True, blank=True)
    determination_Kng = models.FloatField(null=True, blank=True)
    determination_lithotype = models.FloatField(null=True, blank=True)

    class Meta:
        verbose_name = 'Petrophysics_table'
