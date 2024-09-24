# Generated by Django 4.0.3 on 2024-03-25 11:12

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PlanStata',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('year', models.IntegerField()),
                ('count_report', models.IntegerField(null=True)),
            ],
            options={
                'verbose_name': 'План',
                'verbose_name_plural': 'План',
                'db_table': 'quality_Plan',
            },
        ),
    ]
