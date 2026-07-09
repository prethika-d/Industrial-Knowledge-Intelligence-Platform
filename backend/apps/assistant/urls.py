from django.urls import path

from .views import AIHistoryDeleteView, AIHistoryView, AIQueryView

app_name = 'assistant'

urlpatterns = [
    path('query/', AIQueryView.as_view(), name='ai_query'),
    path('history/', AIHistoryView.as_view(), name='ai_history'),
    path('history/<uuid:id>/', AIHistoryDeleteView.as_view(), name='ai_history_delete'),
]
