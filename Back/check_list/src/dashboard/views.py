from dataclasses import dataclass
from django.db.models import Subquery, OuterRef, Q
from django.shortcuts import render
from django.http import JsonResponse

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from dateutil.parser import parse as du_parse
from dateutil.relativedelta import relativedelta
from datetime import *
import copy
import random

from quality.quality_control.models import Quality_control
from customer_companies.customers.models import Customer
from customer_companies.wellbores.models import Wellbore
from quality.plan.models import PlanStata
from service_companies.services.models import Service



@dataclass
class PlanReplacer:
    """Структура для замены пустых значений на 0"""
    count_report: int
    year: int


class Dashboard(APIView):
    """ Класс статистики """
    permission_classes = [IsAuthenticated]
    date_today=date.today()

    date_start = datetime.strptime("01-01-"+str(date_today.year), '%d-%m-%Y').date()
    date_end = date.today()
    customer = None
    service_company = None
    wellbore = None
    accompaniment_type = None
    status_wellbore = None
    well_operation = None

    def post(self, request, *args, **kwargs):
        """TODO делаем присвоение полям класса значений из request"""
        data = {
            'date_start': 'Дата начала',
            'date_end': 'Дата конца',
            'customer': 'Общество',
            'service_company': 'Сервисная компания',
            'wellbore': 'Ствол',
            'accompaniment_type': 'Сопровождение',
            'status_wellbore': 'Статус скважины',
            'well_operation': 'Скважинные операции'
        }
        # print('request=', request.data)
        self.edit_filter_data(request.data)
        return self.get(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        delta = relativedelta(du_parse(str(self.date_end)),
                              du_parse(str(self.date_start)))

        month_count = (delta.years * 12) + delta.months+1

        # выбор записей из интервала
        date_object = Quality_control.objects.select_related('wellbore__well__cluster__field__customer').values(
            'wellbore__well__cluster__field__customer__name',
            'full_inform_set',
            'digital_data_set',
            'quality_control_set',
            'density',
            'section_interval_start',
            'section_interval_end',
            'data_of_created',
            'date_of_changed',
            'data_type',
            'note',
            'start_date',
            'end_date',
            'accompaniment_type',
            'complex_definition',
            'wellbore',
            'wellbore__well__id',
            'wellbore__well__well_type',
            'service_company'
        )
        date_object = date_object.filter(**self.get_filter())
        if self.well_operation:
            date_object = date_object.values('wellbore__well__id').distinct()
        # разбиение записей по месяцам
        current_month = self.date_start.month
        current_year = self.date_start.year
        month_obj = []
        month_obj_plan=[]
        for _ in range(month_count):
            p = PlanStata.objects.get(
                year=int(current_year),
                month=int(current_month)
            )
            month_obj.append({'year': current_year,
                              'month': current_month,
                              'obj': date_object.filter(
                                  data_of_created__month=current_month,
                                  data_of_created__year=current_year, )
                              })
            month_obj_plan.append({
                'year': current_year,
                'month': current_month,
                'obj': p.count_report
            })
            if current_month > 12:
                current_year += 1
                current_month = 1
            else:
                current_month += 1

        # Дашборт операции по годам
        operation_by_year = []
        for my_year in range(self.date_end.year-3, self.date_end.year + 1):
            operation_by_year.append({"year": my_year,
                                      "obj": Quality_control.objects.filter(data_of_created__year=my_year).count()}
                                     )

        # Дашборт с бизнес-планом
        plan, accumulate_plan = copy.deepcopy(month_obj_plan), copy.deepcopy(month_obj_plan)
        fact, accumulate_fact = copy.deepcopy(month_obj), copy.deepcopy(month_obj)
        for index in range(month_count):
            fact[index]['obj'] = fact[index]['obj'].count()
            if index == 0:
                #accumulate_plan[index]['obj'] = p.count_report
                accumulate_fact[index]['obj'] = fact[index]['obj']
                accumulate_plan[index]['obj'] = plan[index]['obj']
            else:
                accumulate_fact[index]['obj'] = accumulate_fact[index - 1]['obj'] + fact[index]['obj']
                accumulate_plan[index]['obj'] = accumulate_plan[index-1]['obj'] + plan[index]['obj']
        # Дашборт с секциями (тип сопровождения)
        section1 = copy.deepcopy(month_obj)
        section2 = copy.deepcopy(month_obj)
        for index in range(month_count):
            section1[index]['obj'] = section1[index]['obj'].filter(accompaniment_type='ТЗ').count()
            section2[index]['obj'] = section2[index]['obj'].filter(accompaniment_type='Круглосуточно').count()


        # Дашборд с обществами customers
        customers_list = []
        for item in Customer.objects.filter(time_deleted__isnull=True):
            customers_list.append(item.name)

        new_customers = copy.deepcopy(month_obj)
        for index in range(month_count):
            new_customers[index]['obj'] = {c: new_customers[index]['obj'].filter(
                wellbore__well__cluster__field__customer__name=c).count() for c in customers_list}

        # Дашборд с сервисами service
        services_list = []
        for item in Service.objects.filter(time_deleted__isnull=True):
            services_list.append(item.name)

        new_services = copy.deepcopy(month_obj)
        for index in range(month_count):
            new_services[index]['obj'] = {c: new_services[index]['obj'].filter(
                service_company__name=c).count() for c in services_list}

        # Дашборд с отчётами (псевдочисла)
        report1 = copy.deepcopy(month_obj)
        report2 = copy.deepcopy(month_obj)
        for index in range(month_count):
            report1[index]['obj'] = random.randint(20, 80)
            report2[index]['obj'] = random.randint(0, 35)

        # [Quality_control.objects.accompaniment_type]
        json_data = {
            'количество-месяцев': month_count,
            'бизнес-план': {'План': plan,
                            'Факт': fact,
                            'Накопл. План': accumulate_plan,
                            'Накопл. Факт': accumulate_fact, },
            'секции по месяцам': {'Круглосуточно': section2,
                                  'Т3': section1, },
            'скважинные операции': operation_by_year,
            'скважины по обществу': new_customers,
            'скважины по сервису': new_services,
            'отправленные отчёты': [],
        }
        return Response(json_data)

    def edit_filter_data(self, new_param) -> bool:
        """Изменение параметров фильтрации"""
        new_param = new_param.get('filterBisness')
        # print("date_start=", new_param.get('data_start'),
        #       "date_end=", new_param.get('data_end'),
        #       "customer=", new_param.get('custoner'),
        #       "service_company=", new_param.get('service_company'),
        #       "wellbore=", new_param.get('wellbore'),
        #       "accompaniment_type=", new_param.get('accompanimente_type'),
        #       "status_wellbore=", new_param.get('statuse_welbore'),
        #       "well_operation=", new_param.get('well_operation'), )

        if new_param.get('data_start'):
            self.date_start = datetime.strptime(str(new_param.get('data_start')), '%Y-%m-%d').date()
        if new_param.get('data_end'):
            self.date_end = datetime.strptime(str(new_param.get('data_end')), '%Y-%m-%d').date()

        self.customer = new_param.get('customer')
        self.service_company = new_param.get('service_company')
        self.wellbore = new_param.get('wellbore')
        self.accompaniment_type = new_param.get('accompaniment_type')
        self.status_wellbore = new_param.get('statuse_welbore')
        self.well_operation = new_param.get('well_operation')
        return True

    def get_filter(self) -> dict:
        """Сформулировать фильтр"""
        # print('Делаем фильтр')
        # print("date_start=", self.date_start,
        #       "date_end=", self.date_end,
        #       "customer=", self.customer,
        #       "service_company=", self.service_company,
        #       "wellbore=", self.wellbore,
        #       "accompaniment_type=", self.accompaniment_type,
        #       "status_wellbore=", self.status_wellbore,
        #       "well_operation=", self.well_operation, )

        data = {"data_of_created__gte": self.date_start,
                "data_of_created__lte": self.date_end,
                }

        if self.customer is not None and self.customer != []:
            data['wellbore__well__cluster__field__customer__name__in'] = self.customer

        if self.service_company is not None:
            if len(self.service_company)>0:
                data['service_company__name__in'] = self.service_company

        if self.wellbore is not None and self.wellbore != '':
            data['wellbore__well__well_type__icontains'] = self.wellbore
        #
        if self.accompaniment_type is not None and self.accompaniment_type != []:
            data['accompaniment_type__in'] = self.accompaniment_type
        #
        if self.status_wellbore is not None  and self.status_wellbore != []:
            data['wellbore__status_wellbore'] = self.status_wellbore
        #
        # print('data=', data)
        return data
