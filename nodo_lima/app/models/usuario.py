from sqlalchemy import Column, Integer, String, Enum
from app.database import Base
import enum

class RolUsuario(str, enum.Enum):
    empresa = "empresa"
    ong = "ong"
    admin = "admin"

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    rol = Column(Enum(RolUsuario, name="rolusuario", create_type=False), nullable=False)
    region = Column(String, nullable=False)

    # Referencia opcional al perfil correspondiente
    empresa_id = Column(Integer, nullable=True)
    ong_id = Column(Integer, nullable=True)