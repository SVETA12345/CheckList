from django.urls import path

from .views import ServiceView, SingleServiceView, RecoveryServiceView, DeletedServiceView, DestroyServiceView, \
    StasticsViewQualityService, ViewCountWellService, ViewPercWellService

app_name = "service_companies.services"
urlpatterns = [
    path('services/', ServiceView.as_view()),
    path('services/<int:pk>', SingleServiceView.as_view()),
    path('del_service/<int:pk>', DestroyServiceView.as_view()),
    path('deleted_services/', DeletedServiceView.as_view()),
    path('stastic_service/', StasticsViewQualityService.as_view()),
    path('count_well_serv/', ViewCountWellService.as_view()),
    path('percent_well_serv/', ViewPercWellService.as_view()),
    path('recovery_service/<int:pk>', RecoveryServiceView.as_view()),
]