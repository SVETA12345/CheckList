from django.urls import path

from .views import StrataView, SingleStrataView, DeletedStrataView, RecoveryStrataView, DestroyStrataView,\
    CustomerCompaniesView, StrataViewOpenFile

get_customers = CustomerCompaniesView.as_view({'get': 'get'})
get_customers_file = CustomerCompaniesView.as_view({'get': 'get_file'})

app_name = "customer_companies.strata"
urlpatterns = [
    path('strata/<int:pk_field>', StrataView.as_view()),
    path('deleted_strata/', DeletedStrataView.as_view()),
    path('strata/id/<int:pk>', SingleStrataView.as_view()),
    path('del_strata/<int:pk>', DestroyStrataView.as_view()),
    path('recovery_strata/<int:pk>', RecoveryStrataView.as_view()),
    path('customers_companies/', get_customers),
    path('customers_file/', get_customers_file),
    path('strata/file/id/<int:pk>', StrataViewOpenFile.as_view()),
]