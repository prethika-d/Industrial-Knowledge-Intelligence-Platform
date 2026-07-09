from django.urls import path

from .views import ActivityFeedView, DashboardStatsView, SystemStatusView

app_name = 'dashboard'

urlpatterns = [
    path('stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('system-status/', SystemStatusView.as_view(), name='system_status'),
    path('activity-feed/', ActivityFeedView.as_view(), name='activity_feed'),
]
