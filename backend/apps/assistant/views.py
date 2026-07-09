import uuid

from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import filters, generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.pagination import StandardResultsPagination

from .models import AIConversation
from .serializers import AIConversationSerializer, AIQuerySerializer
from .services import get_ai_provider


@extend_schema(tags=['AI Assistant'])
class AIQueryView(APIView):
    """POST /api/assistant/query/ — ask a question, get an answer grounded in the knowledge base."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AIQuerySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        query = serializer.validated_data['query']
        session_id = serializer.validated_data.get('session_id') or uuid.uuid4()

        history_qs = AIConversation.objects.filter(session_id=session_id).order_by('timestamp')
        history = [{'role': 'user', 'text': c.query} for c in history_qs]

        provider = get_ai_provider()
        result = provider.answer(query, history=history)

        conversation = AIConversation.objects.create(
            session_id=session_id,
            user=request.user,
            query=query,
            response=result['response'],
            sources=result['sources'],
            model_used=result['model_used'],
        )

        return Response(
            {
                'id': conversation.id,
                'session_id': conversation.session_id,
                'role': 'assistant',
                'text': conversation.response,
                'sources': conversation.sources,
                'model_used': conversation.model_used,
                'timestamp': conversation.timestamp,
            },
            status=status.HTTP_201_CREATED,
        )


@extend_schema(tags=['AI Assistant'])
class AIHistoryView(generics.ListAPIView):
    """GET /api/assistant/history/ — list past queries/responses for the authenticated user."""

    serializer_class = AIConversationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['session_id', 'model_used']
    search_fields = ['query', 'response']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']

    def get_queryset(self):
        return AIConversation.objects.filter(user=self.request.user)


@extend_schema(tags=['AI Assistant'])
class AIHistoryDeleteView(generics.DestroyAPIView):
    """DELETE /api/assistant/history/<id>/ — remove a single conversation turn."""

    serializer_class = AIConversationSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return AIConversation.objects.filter(user=self.request.user)
