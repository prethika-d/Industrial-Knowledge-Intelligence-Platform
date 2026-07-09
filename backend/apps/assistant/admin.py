from django.contrib import admin

from .models import AIConversation


@admin.register(AIConversation)
class AIConversationAdmin(admin.ModelAdmin):
    list_display = ['user', 'query', 'model_used', 'timestamp']
    search_fields = ['query', 'response']
    list_filter = ['model_used']
    readonly_fields = ['id', 'timestamp']
