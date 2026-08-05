from rest_framework import serializers
from .models import Machine, ProductionOrder

class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = [
                    "id", 
                    "name", 
                    "is_active"
                 ]

class ProductionOrderSerializer(serializers.ModelSerializer):
    machine_name = serializers.CharField(
        source="machine.name", read_only=True)

    class Meta:
        model = ProductionOrder
        fields =    [  
                        "id", 
                        "machine", 
                        "machine_name", 
                        "product_name", 
                        "quantity", 
                        "status", 
                        "created_at"
                    ]