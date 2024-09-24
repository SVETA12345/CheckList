import io
import os
import platform
from time import sleep

import openpyxl
from django.core.files.storage import FileSystemStorage, default_storage
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PlanStata


# Create your views here.

class PlanView(APIView):
    """Загрузка файла из excel файла"""
    start_cell = 'B2'
    end_cell = 'F20'
    title = 'Интерпретация ГИС'
    date_cell = 'A1'
    old_file = list()

    def post(self, request):
        fs = FileSystemStorage()
        if request.FILES.get('plan'):
            file = default_storage.save(request.FILES.get('plan').name, request.FILES.get('plan'))
            path =os.getcwd() +'/check_list/src/files_root/' + file
            with open(path, "rb") as f:
                in_mem_file = io.BytesIO(f.read())
            workbook = openpyxl.load_workbook(path, read_only=True, data_only=True)
            sheet = workbook.active
            start_date = int(sheet['A2'].value)
            data_obj = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0}
            for i in range(2, 100000):
                if not sheet['B'+str(i)].value:
                    break
                else:
                    if ( str(sheet['F'+str(i)].value).isnumeric() ):
                        data_obj[int(sheet['B'+str(i)].value)] += int(sheet['F'+str(i)].value)
#                p = PlanStata.objects.get_or_create(year=start_date)
#                p[0].month = int(sheet['B'+str(i)].value)
#                p[0].count_report = int(sheet['F'+str(i)].value)
#                p[0].save()
#                start_date += 1
            workbook.close()
            for key in data_obj.keys():
                print(key, data_obj[key])
                p = PlanStata.objects.get_or_create(
                    year=start_date,
                    month=key
                )
                p[0].count_report = data_obj[key]
                p[0].save()

            print('p', p)
            # os.remove(path)
            return Response({'status': 'ok'})
        return Response({'status': 'Ошибка при отправке файла. Файл по ключ plan не найден!'})
