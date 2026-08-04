from rest_framework import serializers

class SystemEventSerializer(serializers.Serializer):
    event_type = serializers.CharField(max_length=120)
    source = serializers.CharField(max_length=120)
    details = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.DateTimeField(required=False)

class OperationLogSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    level = serializers.CharField(required=False, allow_blank=True)
    message = serializers.CharField(required=False, allow_blank=True)
    machine_id = serializers.IntegerField()
    meta = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.DateTimeField(required=False)