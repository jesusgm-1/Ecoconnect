from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class ONG(Base):
    __tablename__ = "ongs"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    region = Column(String, default="lima")
    verificada = Column(Boolean, default=False)
    categorias_interes = Column(String, nullable=True)

    transferencias = relationship("Transferencia", back_populates="ong")