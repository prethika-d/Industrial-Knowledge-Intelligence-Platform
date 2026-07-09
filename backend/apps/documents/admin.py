from django.contrib import admin

from .models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['original_name', 'file_type', 'category', 'processing_status', 'uploaded_by', 'upload_date']
    list_filter = ['file_type', 'category', 'processing_status']
    search_fields = ['original_name', 'filename']
    readonly_fields = ['id', 'upload_date', 'updated_at']
