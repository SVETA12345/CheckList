from django.urls import path

from del_service.views import RemoveView
from .views import (CustomerView, SingleCustomerView, DeletedCustomerView, RecoveryCustomerView, DestroyCustomerView,
                    StasticsViewCountWell, StasticsViewPercentWells, StasticsViewTimeWells, StasticsViewQualityCustomer,
                    LoadView,
                    CustomerQualView)

app_name = "customer_companies.customers"
urlpatterns = [
    path('customers/', CustomerView.as_view()),
    path('quality_customers/', CustomerQualView.as_view()),
    path('customers/<int:pk>', SingleCustomerView.as_view(), name='customer'),
    path('deleted_customers/', DeletedCustomerView.as_view()),
    path('recovery_customer/<int:pk>', RecoveryCustomerView.as_view()),
    path('del_customer/<int:pk>', DestroyCustomerView.as_view()),
    # path('remove', RemoveView.as_view()),
    # path('load', LoadView.as_view()),
    path('count_well/', StasticsViewCountWell.as_view()),
    path('percent_well/', StasticsViewPercentWells.as_view()),
    path('stastic_customer/', StasticsViewQualityCustomer.as_view()),
    path('time_well/', StasticsViewTimeWells.as_view())
]
