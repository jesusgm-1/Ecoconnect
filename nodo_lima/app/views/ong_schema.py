from pydantic import BaseModel
from typing import Optional

class ONGCreate(BaseModel):
    nombre: str
    email: str
    region: str = "lima"
    categorias_interes: Optional[str] = None

class ONGResponse(BaseModel):
    id: int
    nombre: str
    email: str
    region: str
    verificada: bool
    categorias_interes: Optional[str]

    class Config:
        from_attributes = True