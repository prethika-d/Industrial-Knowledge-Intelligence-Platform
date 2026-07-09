"""
Service layer for the AI Assistant.

`get_ai_provider()` returns a provider implementing `.answer(query, history)`.
Swap the mock for a real integration by setting AI_PROVIDER in the environment
to 'openai', 'claude', or 'ollama' and filling in the corresponding class below.
"""
import random
from abc import ABC, abstractmethod

from decouple import config

MOCK_SOURCE_POOL = [
    'Compressor SOP-14.pdf',
    'Line 3 Maintenance Log',
    'Boiler Safety Manual Rev.3',
    'Hydraulic Pump Housing Spec Sheet',
    'Unit 7 Inspection Report',
]

MOCK_RESPONSES = [
    "Based on the indexed documentation, {query_snippet} is addressed in the referenced "
    "manuals below. Torque and safety specs should always be cross-checked against the "
    "latest revision before performing maintenance.",
    "I found relevant guidance for '{query_snippet}' in your knowledge base. Please review "
    "the cited sources for exact procedure steps and safety precautions.",
    "Here's what the uploaded documentation says about '{query_snippet}'. Let me know if "
    "you'd like more detail on any specific section.",
]


class BaseAIProvider(ABC):
    name = 'base'

    @abstractmethod
    def answer(self, query: str, history: list[dict] | None = None) -> dict:
        """Return {'response': str, 'sources': list[str], 'model_used': str}"""
        raise NotImplementedError


class MockAIProvider(BaseAIProvider):
    """Deterministic-ish mock so the frontend has believable data end-to-end today."""

    name = 'mock-assistant-v1'

    def answer(self, query: str, history: list[dict] | None = None) -> dict:
        snippet = query.strip().rstrip('?')
        if len(snippet) > 60:
            snippet = snippet[:60] + '...'
        template = random.choice(MOCK_RESPONSES)
        sources = random.sample(MOCK_SOURCE_POOL, k=min(2, len(MOCK_SOURCE_POOL)))
        return {
            'response': template.format(query_snippet=snippet),
            'sources': sources,
            'model_used': self.name,
        }


class OpenAIProvider(BaseAIProvider):
    """Stub — wire up `openai` SDK here when ready."""

    name = 'openai-gpt'

    def answer(self, query: str, history: list[dict] | None = None) -> dict:
        raise NotImplementedError('OpenAI provider not yet configured. Set OPENAI_API_KEY and implement this class.')


class ClaudeProvider(BaseAIProvider):
    """Stub — wire up the `anthropic` SDK here when ready."""

    name = 'claude'

    def answer(self, query: str, history: list[dict] | None = None) -> dict:
        raise NotImplementedError('Claude provider not yet configured. Set ANTHROPIC_API_KEY and implement this class.')


class OllamaProvider(BaseAIProvider):
    """Stub — call a local Ollama server here when ready."""

    name = 'ollama'

    def answer(self, query: str, history: list[dict] | None = None) -> dict:
        raise NotImplementedError('Ollama provider not yet configured. Set OLLAMA_HOST and implement this class.')


_PROVIDERS = {
    'mock': MockAIProvider,
    'openai': OpenAIProvider,
    'claude': ClaudeProvider,
    'ollama': OllamaProvider,
}


def get_ai_provider() -> BaseAIProvider:
    provider_key = config('AI_PROVIDER', default='mock')
    provider_cls = _PROVIDERS.get(provider_key, MockAIProvider)
    return provider_cls()
