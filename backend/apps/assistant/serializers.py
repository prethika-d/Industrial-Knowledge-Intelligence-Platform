from rest_framework import serializers

from .models import AIConversation


class AIQuerySerializer(serializers.Serializer):
    query = serializers.CharField(allow_blank=False, trim_whitespace=True)
    session_id = serializers.UUIDField(required=False)


class AIConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIConversation
        fields = [
            'id', 'session_id', 'user', 'query', 'response',
            'sources', 'model_used', 'timestamp',
        ]
        read_only_fields = fields


class ChatMessageSerializer(serializers.Serializer):
    """Shapes a single AIConversation row into the two chat bubbles the
    frontend's `messages` state array expects (user question + assistant answer)."""

    id = serializers.UUIDField()
    session_id = serializers.UUIDField()
    user_message = serializers.SerializerMethodField()
    assistant_message = serializers.SerializerMethodField()
    timestamp = serializers.DateTimeField()

    def get_user_message(self, obj):
        return {'role': 'user', 'text': obj.query}

    def get_assistant_message(self, obj):
        return {'role': 'assistant', 'text': obj.response, 'sources': obj.sources}
