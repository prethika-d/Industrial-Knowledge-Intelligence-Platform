from django.contrib import admin

from .models import Activity, SystemStatus


@admin.register(SystemStatus)
class SystemStatusAdmin(admin.ModelAdmin):
    list_display = ['service_name', 'status', 'latency_ms', 'uptime_percentage', 'health_percentage', 'updated_at']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['action', 'text', 'user', 'timestamp']
    list_filter = ['action']
    search_fields = ['text']
