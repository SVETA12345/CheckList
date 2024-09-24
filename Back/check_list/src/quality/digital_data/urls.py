from django.urls import path

from .views import Digital_dataView, SingleDigital_dataView, Digital_dataCreateView

app_name = "quality.digital_data"
urlpatterns = [
    path('digital_data/<int:pk_quality_control>', Digital_dataCreateView.as_view()),
    path('digital_data/', Digital_dataView.as_view()),
    path('digital_data/id/<int:pk>', SingleDigital_dataView.as_view()),
]