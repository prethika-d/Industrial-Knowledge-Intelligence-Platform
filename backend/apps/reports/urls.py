from django.urls import path

from .views import (
    ReportDetailView,
    ReportDownloadView,
    ReportGenerateView,
    ReportListView,
)

app_name = 'reports'

urlpatterns = [
    path('', ReportListView.as_view(), name='report_list'),
    path('generate/', ReportGenerateView.as_view(), name='report_generate'),
    path('download/<str:reference>/', ReportDownloadView.as_view(), name='report_download'),
    path('<str:reference>/', ReportDetailView.as_view(), name='report_detail'),
]
