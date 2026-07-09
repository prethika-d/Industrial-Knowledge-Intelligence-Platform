from django.urls import path

from .views import AnalyticsChartsView, AnalyticsOverviewView, AnalyticsUsageView

app_name = 'analytics'

urlpatterns = [
    path('overview/', AnalyticsOverviewView.as_view(), name='analytics_overview'),
    path('usage/', AnalyticsUsageView.as_view(), name='analytics_usage'),
    path('charts/', AnalyticsChartsView.as_view(), name='analytics_charts'),
]
