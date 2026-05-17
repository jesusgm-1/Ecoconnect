from pydantic import BaseModel

class EmpresaCreate(BaseModel):
    nombre: str
    ruc: str
    email: str
    region: str = "lima"

class EmpresaResponse(BaseModel):
    id: int
    nombre: str
    ruc: str
    email: str
    region: str

    class Config:
        from_attributes = True