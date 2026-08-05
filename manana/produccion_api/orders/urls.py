from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import MachineViewSet, ProductionOrderViewSet
from .system_events_view import system_events_list_create, system_events_detail
from .operation_logs_view import operation_logs_list_create, operation_logs_detail


router = DefaultRouter()
router.register(r"machines", MachineViewSet, basename="machines")
router.register(r"production-orders", ProductionOrderViewSet, basename="production-orders")

urlpatterns = [
    # Mongo
    path("operation-logs/", operation_logs_list_create),
    path("operation-logs/<str:id>/", operation_logs_detail),
    path("system-events/", system_events_list_create),
    path("system-events/<str:id>/", system_events_detail),
]
urlpatterns += router.urls