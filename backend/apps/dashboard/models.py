from django.conf import settings
from django.db import models


class SystemStatus(models.Model):
    class Health(models.TextChoices):
        OPERATIONAL = 'Operational', 'Operational'
        DEGRADED = 'Degraded', 'Degraded'
        DOWN = 'Down', 'Down'

    service_name = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=Health.choices, default=Health.OPERATIONAL)
    latency_ms = models.PositiveIntegerField(default=0, help_text='Latest observed latency in milliseconds')
    uptime_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=99.9)
    health_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=100)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'system_status'
        ordering = ['service_name']
        verbose_name_plural = 'System statuses'

    def __str__(self):
        return f'{self.service_name}: {self.status}'


class Activity(models.Model):
    class Action(models.TextChoices):
        UPLOAD = 'upload', 'Document Upload'
        QUERY_RESOLVED = 'query_resolved', 'AI Query Resolved'
        REPORT_GENERATED = 'report_generated', 'Report Generated'
        DOCUMENT_INDEXED = 'document_indexed', 'Document Indexed'
        LOGIN = 'login', 'User Login'
        OTHER = 'other', 'Other'

    action = models.CharField(max_length=30, choices=Action.choices, default=Action.OTHER)
    text = models.CharField(max_length=255)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='activities',
        null=True, blank=True,
    )
    metadata = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'activities'
        ordering = ['-timestamp']
        verbose_name_plural = 'Activities'
        indexes = [models.Index(fields=['-timestamp'])]

    def __str__(self):
        return self.text
