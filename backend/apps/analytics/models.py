from django.db import models


class MetricName(models.TextChoices):
    QUERY_ACCURACY = 'query_accuracy', 'Query Accuracy'
    AVG_RESPONSE_TIME = 'avg_response_time', 'Avg Response Time'
    MONTHLY_ACTIVE_USERS = 'monthly_active_users', 'Monthly Active Users'
    QUERY_GROWTH = 'query_growth', 'Query Growth'
    QUERIES = 'queries', 'AI Queries'
    UPLOADS = 'uploads', 'Uploads'
    DEPARTMENT_USAGE = 'department_usage', 'Department Usage'


class Analytics(models.Model):
    """
    Generic metric row. `period` holds either a snapshot marker ('current')
    or a month key ('2026-06') for time-series metrics. `dimension` optionally
    labels a breakdown axis (e.g. a department name for department_usage rows).
    """

    metric_name = models.CharField(max_length=40, choices=MetricName.choices)
    value = models.FloatField()
    unit = models.CharField(max_length=20, blank=True, default='')
    period = models.CharField(max_length=20, default='current')
    dimension = models.CharField(max_length=100, blank=True, default='')
    delta_label = models.CharField(max_length=100, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'analytics_metrics'
        ordering = ['metric_name', 'period']
        indexes = [
            models.Index(fields=['metric_name', 'period']),
        ]
        verbose_name_plural = 'Analytics'

    def __str__(self):
        return f'{self.metric_name} ({self.period}): {self.value}'
