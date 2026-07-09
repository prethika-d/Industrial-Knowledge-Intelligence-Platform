import os

from django.conf import settings
from django.db import models


class ReportType(models.TextChoices):
    MAINTENANCE = 'Maintenance', 'Maintenance'
    SAFETY = 'Safety', 'Safety'
    ENGINEERING = 'Engineering', 'Engineering'
    ANALYTICS = 'Analytics', 'Analytics'
    QUALITY = 'Quality', 'Quality'


class ReportStatus(models.TextChoices):
    PROCESSING = 'processing', 'Processing'
    READY = 'ready', 'Ready'
    FAILED = 'failed', 'Failed'


def report_upload_path(instance, filename):
    return f'reports/{instance.reference}.pdf'


class Report(models.Model):
    reference = models.CharField(max_length=20, unique=True, editable=False, blank=True)
    title = models.CharField(max_length=255)
    report_type = models.CharField(max_length=20, choices=ReportType.choices, default=ReportType.MAINTENANCE)
    generated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reports'
    )
    file = models.FileField(upload_to='reports/', blank=True, null=True)
    status = models.CharField(max_length=15, choices=ReportStatus.choices, default=ReportStatus.PROCESSING)
    summary = models.TextField(blank=True, default='')
    generated_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'reports'
        ordering = ['-generated_at']

    def __str__(self):
        return f'{self.reference} — {self.title}'

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        if is_new and not self.reference:
            self.reference = f'RPT-{2000 + self.pk}'
            super().save(update_fields=['reference'])

    def delete(self, *args, **kwargs):
        if self.file and os.path.isfile(self.file.path):
            os.remove(self.file.path)
        super().delete(*args, **kwargs)
