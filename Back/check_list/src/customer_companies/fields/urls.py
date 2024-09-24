from django.urls import path
from .views import FieldView, SingleFieldView, CustomerFieldsView, RecoveryFieldView, DeletedFieldView, \
    DestroyFieldView

customer_list = CustomerFieldsView.as_view({'get': 'list'})

# deleted_customer_list = CustomerFieldsView.as_view({'get': 'deleted_list'})

app_name = "customer_companies.fields"
urlpatterns = [
    path('fields/<int:pk_customer>', FieldView.as_view()),
    path('fields/id/<int:pk>', SingleFieldView.as_view()),
    path('del_field/<int:pk>', DestroyFieldView.as_view()),
    path('full_data_customers/', customer_list),
    path('deleted_fields/', DeletedFieldView.as_view()),
    path('recovery_field/<int:pk>', RecoveryFieldView.as_view()),
    # path('full_deleted_data_customers/', deleted_customer_list),
]