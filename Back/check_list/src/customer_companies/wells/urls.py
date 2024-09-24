from django.urls import path

from .views import WellView, SingleWellView, DeletedWellView, RecoveryWellView, DestroyWellView

app_name = "customer_companies.wells"
urlpatterns = [
    path('wells/<int:pk_cluster>', WellView.as_view()),
    path('wells/id/<int:pk>', SingleWellView.as_view()),
    path('del_well/<int:pk>', DestroyWellView.as_view()),
    path('recovery_well/<int:pk>', RecoveryWellView.as_view()),
    path('deleted_wells/', DeletedWellView.as_view()),
]