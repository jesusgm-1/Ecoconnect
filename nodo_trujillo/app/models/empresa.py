from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Empresa(Base):
    __tablename__ = "empresas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    ruc = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    region = Column(String, default="lima")

    excedentes = relationship("Excedente", back_populates="empresa")