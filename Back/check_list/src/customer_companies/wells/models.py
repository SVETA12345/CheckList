from django.db import models

from ..clusters.models import Cluster


class Well(models.Model):
    class Types(models.TextChoices):
        Horizontal = 'Горизонтальная'
        Vertical = 'Вертикальная'
        Oblique_directional = 'Наклонно-направленная'
        # Side_slanted_barrel = 'Боковой наклонно-направленный ствол'
        # Side_horizontal_wellbore = 'Боковой горизонтальный ствол'
        MZS = 'Многозабойная'
        MCC = 'Многоствольная'
        # Multilateral_horizontal_sidetrack = 'Многозабойный боковой горизонтальный ствол'
        None_value = ''

    # class Types(models.TextChoices):
    #     Horizontal = 'Горизонтальная'
    #     Vertical = 'Вертикальная'
    #     Oblique_directional = 'Наклонно-направленная'
    #     Side_slanted_barrel = 'Боковой наклонно-направленный ствол'
    #     Side_horizontal_wellbore = 'Боковой горизонтальный ствол'
    #     MZS = 'Многозабойная скважина'
    #     MCC = 'Многоствольная скважина'
    #     Multilateral_horizontal_sidetrack = 'Многозабойный боковой горизонтальный ствол'
    #     None_value = ''

    num_well = models.CharField(max_length=120)
    num_pad = models.CharField(max_length=120)
    well_type = models.CharField(max_length=120, choices=Types.choices, blank=True)
    time_deleted = models.DateTimeField(null=True, blank=True)

    cluster = models.ForeignKey(Cluster, related_name='cluster_set', on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Well'
        verbose_name_plural = 'Wells'
        ordering = ['num_well']
