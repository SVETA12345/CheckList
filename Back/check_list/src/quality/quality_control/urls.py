from django.urls import path

from .views import Quality_controlView, SingleQuality_controlView, FullGetView, FullPostView, AllQuality_controlView, \
    ViewSaveFile, RecoveryQualityView, DestroyQualityView, SingleStrataView, SampleView

not_del_list = AllQuality_controlView.as_view({'get': 'not_del_get'})
del_list = AllQuality_controlView.as_view({'get': 'del_get'})

get_pdf_file = ViewSaveFile.as_view({'get': 'get_pdf'})
get_xlsx_file = ViewSaveFile.as_view({'get': 'get_xlsx'})

app_name = "quality.quality_control"
urlpatterns = [
    path('quality_control/<int:pk_wellbore>', Quality_controlView.as_view()),
    path('quality_control/id/<int:pk>', SingleQuality_controlView.as_view()),
    path('quality_control/', not_del_list),
    path('deleted_quality/', del_list),
    path('del_quality/<int:pk>', DestroyQualityView.as_view()),
    path('full_get/<int:pk>', FullGetView.as_view()),
    path('full_post/', FullPostView.as_view()),
    path('save_file_xlsx/<int:pk>', get_xlsx_file),
    path('save_file_pdf/<int:pk>', get_pdf_file),
    path('recovery_quality/<int:pk>', RecoveryQualityView.as_view()),
    path('sample_file/', SampleView.as_view()),
    path('get_sample_file/', SingleStrataView.as_view()),
    path('get_excel_report/', SingleStrataView.as_view()),
]