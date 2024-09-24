from django.urls import path

from .views import Petrophysics_tableView, SinglePetrophysics_tableView, DeletedPetrophysics_tableView, \
    RecoveryPetrophysics_tableView, DestroyPetrophysics_tableView

app_name = "customer_companies.petrophysics_table"
urlpatterns = [
    path('petrophysics/<int:pk_field>/<int:pk_method>', Petrophysics_tableView.as_view()),
    path('deleted_petrophysics/', DeletedPetrophysics_tableView.as_view()),
    path('petrophysics/id/<int:pk>', SinglePetrophysics_tableView.as_view()),
    path('del_petrophysic/<int:pk>', DestroyPetrophysics_tableView.as_view()),
    path('recovery_petrophysics/<int:pk>', RecoveryPetrophysics_tableView.as_view()),
]