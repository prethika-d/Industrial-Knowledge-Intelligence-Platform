from rest_framework.permissions import SAFE_METHODS, BasePermission


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS


class IsOwner(BasePermission):
    """Generic object-owner check; looks for a `uploaded_by`, `generated_by`, or `user` field."""

    owner_fields = ('uploaded_by', 'generated_by', 'user')

    def has_object_permission(self, request, view, obj):
        for field in self.owner_fields:
            if hasattr(obj, field):
                return getattr(obj, field) == request.user
        return False


class RoleRequired(BasePermission):
    """Factory-style permission — subclass and set `allowed_roles`."""

    allowed_roles = ()

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.role in self.allowed_roles or request.user.is_superuser)
        )
