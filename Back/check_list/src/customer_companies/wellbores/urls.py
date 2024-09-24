from django.urls import path

from .views import WellboreView, SingleWellboreView, RecoveryWellboreView, DeletedWellboreView, DestroyWellboreView,\
    SummaryView

app_name = "customer_companies.wellbores"
urlpatterns = [
    path('wellbores/<int:pk_well>', WellboreView.as_view()),
    path('wellbores/id/<int:pk>', SingleWellboreView.as_view()),
    path('del_wellbore/<int:pk>', DestroyWellboreView.as_view()),
    path('recovery_wellbore/<int:pk>', RecoveryWellboreView.as_view()),
    path('deleted_wellbores/', DeletedWellboreView.as_view()),
    path('department_summary/', SummaryView.as_view()),
]
