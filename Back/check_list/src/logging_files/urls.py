from django.urls import path

from logging_files.views import GetWeekTimeView, GetRangeTimeView

app_name = "logging_files"
urlpatterns = [
    path('get_week_log/', GetWeekTimeView.as_view()),
    path('get_range_log', GetRangeTimeView.as_view())
]