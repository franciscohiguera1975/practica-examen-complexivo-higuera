from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Machine, ProductionOrder
from .serializers import MachineSerializer, ProductionOrderSerializer
from .permissions import IsAdminOrReadOnly

class MachineViewSet(viewsets.ModelViewSet):
    queryset = Machine.objects.all().order_by("id")
    serializer_class = MachineSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["id", "name", "is_active"]

class ProductionOrderViewSet(viewsets.ModelViewSet):
    queryset = ProductionOrder.objects.select_related("machine").all().order_by("-id")
    serializer_class = ProductionOrderSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["machine"]
    search_fields = ["product_name"]
    ordering_fields = ["id", "created_at"]

    def get_permissions(self):
        # Público: SOLO listar órdenes de producción
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()