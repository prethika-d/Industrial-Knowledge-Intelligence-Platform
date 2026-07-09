import time
from datetime import timedelta

from django.utils import timezone


def humanize_timedelta(dt):
    """Convert a datetime into a short 'time ago' string, e.g. '6 min ago', '3 hr ago'."""
    now = timezone.now()
    diff = now - dt
    seconds = diff.total_seconds()

    if seconds < 60:
        return 'just now'
    minutes = int(seconds // 60)
    if minutes < 60:
        return f'{minutes} min ago'
    hours = int(minutes // 60)
    if hours < 24:
        return f'{hours} hr ago'
    days = int(hours // 24)
    if days < 7:
        return f'{days} day{"s" if days > 1 else ""} ago'
    weeks = int(days // 7)
    if weeks < 5:
        return f'{weeks} week{"s" if weeks > 1 else ""} ago'
    months = int(days // 30)
    return f'{months} month{"s" if months > 1 else ""} ago'


def format_file_size(num_bytes):
    """Human-readable file size, mirrors the frontend's formatSize() helper."""
    if num_bytes < 1024:
        return f'{num_bytes} B'
    if num_bytes < 1024 * 1024:
        return f'{num_bytes / 1024:.1f} KB'
    return f'{num_bytes / (1024 * 1024):.1f} MB'


def generate_reference_code(prefix, number):
    """e.g. generate_reference_code('RPT', 2041) -> 'RPT-2041'"""
    return f'{prefix}-{number}'


def timed_operation(func):
    """Decorator that measures and returns execution duration in ms alongside result."""

    def wrapper(*args, **kwargs):
        start = time.monotonic()
        result = func(*args, **kwargs)
        elapsed_ms = round((time.monotonic() - start) * 1000, 1)
        return result, elapsed_ms

    return wrapper
