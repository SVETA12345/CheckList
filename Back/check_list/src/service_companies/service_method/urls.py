from django.urls import path

from .views import DestroyService_methodView, Service_methodCreateView, DeviceMethodViewForService, \
    ServiceMethodDeviceViewForService, DeletedService_methodsView, RecoveryServiceMethodView, ServiceCompaniesView

time_destroy = DestroyService_methodView.as_view({'delete': 'time_destroy'})
full_destroy = DestroyService_methodView.as_view({'delete': 'full_destroy'})
get_tools = ServiceCompaniesView.as_view({'get': 'get'})
get_tools_file = ServiceCompaniesView.as_view({'get': 'get_file'})

app_name = "service_companies.service_method"
urlpatterns = [
    path('service_methods/<int:pk_service>/<int:pk_method>', Service_methodCreateView.as_view()),
    path('service_devices/<int:pk_service>', DeviceMethodViewForService.as_view()),
    # path('service_devices/<int:pk_service>/<int:pk_method>', Service_method_deviceView.as_view()),
    path('service_methods/id/<int:pk>', time_destroy),
    path('del_service_method/<int:pk>', full_destroy),
    path('recovery_service_method/<int:pk>', RecoveryServiceMethodView.as_view()),
    # path('service_devices/id/<int:pk>', SingleService_deviceView.as_view()),
    path('deleted_service_methods/', DeletedService_methodsView.as_view()),
    path('full_data_services/<int:pk_service>', ServiceMethodDeviceViewForService.as_view()),
    path('service_companies/', get_tools),
    path('service_file/', get_tools_file),
]