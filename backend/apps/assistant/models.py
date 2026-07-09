import uuid

from django.conf import settings
from django.db import models


class AIConversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session_id = models.UUIDField(default=uuid.uuid4, db_index=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ai_conversations'
    )
    query = models.TextField()
    response = models.TextField()
    sources = models.JSONField(default=list, blank=True)
    model_used = models.CharField(max_length=100, default='mock-assistant-v1')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ai_conversations'
        ordering = ['timestamp']
        indexes = [
            models.Index(fields=['session_id']),
            models.Index(fields=['-timestamp']),
        ]

    def __str__(self):
        return f'{self.user.email}: {self.query[:40]}'
