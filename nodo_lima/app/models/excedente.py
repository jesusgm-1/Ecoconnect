from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import enum

class EstadoExcedente(str, enum.Enum):
    disponible = "disponible"
    bloqueado = "bloqueado"
    transferido = "transferido"
    vencido = "vencido"

class Excedente(Base):
    __tablename__ = "excedentes"

    id = Column(Integer, primary_key=True, index=True)
    tipo_recurso = Column(String, nullable=False)
    cantidad = Column(Float, nullable=False)
    unidad = Column(String, nullable=False)
    fecha_limite = Column(DateTime, nullable=False)
    ubicacion = Column(String, nullable=False)
    estado = Column(Enum(EstadoExcedente, name="estadoexcedente", create_type=False), default=EstadoExcedente.disponible)
    fecha_registro = Column(DateTime, default=datetime.utcnow)

    empresa_id = Column(Integer, ForeignKey("empresas.id"))
    empresa = relationship("Empresa", back_populates="excedentes")
    transferencia = relationship("Transferencia", back_populates="excedente")