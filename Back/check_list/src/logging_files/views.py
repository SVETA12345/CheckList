import json
from datetime import datetime

from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from logging_files.service_logics import range_amount_days, read_line


#  возвращает информацию по логгированию за неделю
class GetWeekTimeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, *args, **kwargs):
        amount_days = 7

        date_end = timezone.localtime(timezone.now()).date()
        # date_start = timezone.localtime(timezone.now()).date()-timezone.timedelta(days=amount_days)
        # print(range_amount_days(amount_days, date_end))
        return Response(range_amount_days(amount_days, date_end))


#  возвращает информацию по логгированию за переданный диапазон
class GetRangeTimeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, *args, **kwargs):

        date_start = datetime.strptime(self.request.data.get("date_start"), "%Y-%m-%d").date()
        date_end = datetime.strptime(self.request.data.get("date_end"), "%Y-%m-%d").date()

        amount_days = abs((date_end - date_start).days)

        if amount_days == 0:
            response_data = read_line()
        else:
            response_data = range_amount_days(amount_days, date_end)

        return Response(response_data)

