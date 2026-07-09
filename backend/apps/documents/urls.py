from django.urls import path

from .views import DocumentDetailView, DocumentListView, DocumentUploadView

app_name = 'documents'

urlpatterns = [
    path('upload/', DocumentUploadView.as_view(), name='document_upload'),
    path('', DocumentListView.as_view(), name='document_list'),
    path('<uuid:id>/', DocumentDetailView.as_view(), name='document_detail'),
]
