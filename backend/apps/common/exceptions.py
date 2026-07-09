import logging

from django.core.exceptions import PermissionDenied
from django.http import Http404
from rest_framework import exceptions as drf_exceptions
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler

logger = logging.getLogger('apps')


def custom_exception_handler(exc, context):
    """
    Wraps DRF's default exception handler to:
      - guarantee a consistent {"error": {...}} envelope for all API errors
      - log unexpected (500-level) exceptions
      - translate Django's Http404 / PermissionDenied into DRF equivalents
    """
    if isinstance(exc, Http404):
        exc = drf_exceptions.NotFound()
    elif isinstance(exc, PermissionDenied):
        exc = drf_exceptions.PermissionDenied()

    response = drf_exception_handler(exc, context)

    if response is not None:
        error_payload = {
            'error': {
                'code': response.status_code,
                'type': exc.__class__.__name__,
                'message': _extract_message(response.data),
                'detail': response.data,
            }
        }
        response.data = error_payload
        return response

    # Unhandled exception -> log it and return a generic 500 payload
    view = context.get('view')
    logger.exception(
        'Unhandled exception in view %s: %s',
        getattr(view, '__class__', type(view)).__name__ if view else 'unknown',
        exc,
    )
    return Response(
        {
            'error': {
                'code': 500,
                'type': exc.__class__.__name__,
                'message': 'An unexpected server error occurred.',
                'detail': str(exc),
            }
        },
        status=500,
    )


def _extract_message(data):
    if isinstance(data, dict):
        if 'detail' in data:
            return str(data['detail'])
        # take the first field error found
        for value in data.values():
            if isinstance(value, list) and value:
                return str(value[0])
            return str(value)
    if isinstance(data, list) and data:
        return str(data[0])
    return str(data)
