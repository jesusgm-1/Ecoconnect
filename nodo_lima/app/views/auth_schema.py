from pydantic import BaseModel
from enum import Enum

class RolUsuario(str, Enum):
    empresa = "empresa"
    ong = "ong"
    admin = "admin"

class RegistroRequest(BaseModel):
    email: str
    password: str
    rol: RolUsuario
    region: str = "lima"
    empresa_id: int = None
    ong_id: int = None

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    rol: str
    region: str