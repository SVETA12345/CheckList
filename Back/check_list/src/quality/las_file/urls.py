from django.urls import path

from .views import Las_fileView, SingleLas_fileView, Las_fileCreateView, Las_read_interval

app_name = "quality.las_file"
urlpatterns = [
    path('las_file/<int:pk_quality_control>', Las_fileCreateView.as_view(), name='las_file_create_view'),
    path('las_file/', Las_fileView.as_view()),
    path('las_file/id/<int:pk>', SingleLas_fileView.as_view(), name='single_las_file_view'),
    path('las_file/get_interval', Las_read_interval.as_view())
]