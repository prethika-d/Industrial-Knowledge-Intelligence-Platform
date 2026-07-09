from django.contrib import admin

from .models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ['reference', 'title', 'report_type', 'status', 'generated_by', 'generated_at']
    list_filter = ['report_type', 'status']
    search_fields = ['reference', 'title']
    readonly_fields = ['reference', 'generated_at', 'updated_at']
