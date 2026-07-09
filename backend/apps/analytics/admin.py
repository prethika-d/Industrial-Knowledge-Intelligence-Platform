from django.contrib import admin

from .models import Analytics


@admin.register(Analytics)
class AnalyticsAdmin(admin.ModelAdmin):
    list_display = ['metric_name', 'value', 'unit', 'period', 'dimension']
    list_filter = ['metric_name', 'period']
    search_fields = ['dimension']
