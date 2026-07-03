from pydantic import BaseModel
from datetime import datetime


class TransferenciaResponse(BaseModel):
    id: int
    fecha_transferencia: datetime
    kg_transferidos: float
    estado: str
    excedente_id: int | None = None
    ong_id: int | None = None

    class Config:
        from_attributes = True