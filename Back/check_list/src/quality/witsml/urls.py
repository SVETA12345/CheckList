from django.urls import path

from .views import WitsmlView, SingleWitsmlView, WitsmlCreateView

app_name = "quality.witsml"
urlpatterns = [
    path('witsml/<int:pk_quality_control>', WitsmlCreateView.as_view(), name='witsml_create_view'),
    path('witsml/', WitsmlView.as_view()),
    path('witsml/id/<int:pk>', SingleWitsmlView.as_view(), name='single_witsml_view'),
]