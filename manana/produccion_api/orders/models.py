from django.db import models

class Machine(models.Model):
    name = models.CharField(max_length=120, unique=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Status(models.TextChoices):
        ACTIVE = "activo", "Activo"
        IN_PROGRESS = "en_progreso", "En Progreso"
        COMPLETED = "finalizado", "Finalizado"

class ProductionOrder(models.Model):
    machine = models.ForeignKey(Machine, on_delete=models.PROTECT, related_name="machines")
    product_name = models.CharField(max_length=120, unique=True)
    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.IN_PROGRESS
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.machine.name} - {self.product_name}"