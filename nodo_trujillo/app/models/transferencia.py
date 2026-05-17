from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Transferencia(Base):
    __tablename__ = "transferencias"

    id = Column(Integer, primary_key=True, index=True)
    fecha_transferencia = Column(DateTime, default=datetime.utcnow)
    kg_transferidos = Column(Float, nullable=False)
    estado = Column(String, default="completada")

    excedente_id = Column(Integer, ForeignKey("excedentes.id"))
    ong_id = Column(Integer, ForeignKey("ongs.id"))

    excedente = relationship("Excedente", back_populates="transferencia")
    ong = relationship("ONG", back_populates="transferencias")