from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class EstadoExcedente(str, Enum):
    disponible = "disponible"
    bloqueado = "bloqueado"
    transferido = "transferido"
    vencido = "vencido"

class ExcedenteCreate(BaseModel):
    tipo_recurso: str
    cantidad: float
    unidad: str
    fecha_limite: datetime
    ubicacion: str
    empresa_id: int

class ExcedenteResponse(BaseModel):
    id: int
    tipo_recurso: str
    cantidad: float
    unidad: str
    fecha_limite: datetime
    ubicacion: str
    estado: EstadoExcedente
    fecha_registro: datetime
    empresa_id: int

    class Config:
        from_attributes = True