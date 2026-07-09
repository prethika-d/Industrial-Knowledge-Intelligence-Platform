from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    """Allows access only to Admin role users."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'admin'
        )


class IsEngineerOrAdmin(BasePermission):
    """Allows write access to Engineers and Admins, read access to anyone authenticated."""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in SAFE_METHODS:
            return True
        return request.user.role in ('admin', 'engineer')


class IsOwnerOrAdmin(BasePermission):
    """Object-level permission: owner of the object or an Admin."""

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        owner = getattr(obj, 'uploaded_by', None) or getattr(obj, 'generated_by', None) or getattr(obj, 'user', None)
        return owner == request.user


class IsViewerReadOnly(BasePermission):
    """Viewers can only perform safe (read-only) methods."""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.role == 'viewer':
            return request.method in SAFE_METHODS
        return True
