import os
import uuid

from django.conf import settings
from django.db import models


def document_upload_path(instance, filename):
    ext = filename.split('.')[-1].lower()
    return f'documents/{uuid.uuid4()}.{ext}'


class DocumentCategory(models.TextChoices):
    MANUAL = 'manual', 'Manual'
    SOP = 'sop', 'SOP'
    INSPECTION_REPORT = 'inspection_report', 'Inspection Report'
    SAFETY = 'safety', 'Safety'
    MAINTENANCE = 'maintenance', 'Maintenance'
    OTHER = 'other', 'Other'


class ProcessingStatus(models.TextChoices):
    QUEUED = 'queued', 'Queued'
    UPLOADING = 'uploading', 'Uploading'
    PROCESSING = 'processing', 'Processing'
    INDEXED = 'indexed', 'Indexed'
    FAILED = 'failed', 'Failed'


class FileType(models.TextChoices):
    PDF = 'pdf', 'PDF'
    DOCX = 'docx', 'DOCX'
    DOC = 'doc', 'DOC'
    TXT = 'txt', 'TXT'
    XLSX = 'xlsx', 'XLSX'


class Document(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.FileField(upload_to=document_upload_path)
    filename = models.CharField(max_length=255)
    original_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=10, choices=FileType.choices)
    size = models.PositiveBigIntegerField(help_text='Size in bytes')
    category = models.CharField(max_length=30, choices=DocumentCategory.choices, default=DocumentCategory.OTHER)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents'
    )
    processing_status = models.CharField(
        max_length=15, choices=ProcessingStatus.choices, default=ProcessingStatus.QUEUED
    )
    upload_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'documents'
        ordering = ['-upload_date']
        indexes = [
            models.Index(fields=['-upload_date']),
            models.Index(fields=['processing_status']),
            models.Index(fields=['category']),
        ]

    def __str__(self):
        return self.original_name

    def delete(self, *args, **kwargs):
        if self.file and os.path.isfile(self.file.path):
            os.remove(self.file.path)
        super().delete(*args, **kwargs)
