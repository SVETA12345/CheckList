from django.urls import path
from .views import ClusterView, SingleClusterView, DeletedClusterView, RecoveryClusterView, DestroyClusterView

app_name = "customer_companies.clusters"
urlpatterns = [
    path('clusters/<int:pk_field>', ClusterView.as_view()),
    path('del_cluster/<int:pk>', DestroyClusterView.as_view()),
    path('deleted_clusters/', DeletedClusterView.as_view()),
    path('clusters/id/<int:pk>', SingleClusterView.as_view()),
    path('recovery_cluster/<int:pk>', RecoveryClusterView.as_view()),
]