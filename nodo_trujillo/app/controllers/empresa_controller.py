from sqlalchemy.orm import Session
from app.models.empresa import Empresa
from app.views.empresa_schema import EmpresaCreate
from fastapi import HTTPException

def crear_empresa(db: Session, datos: EmpresaCreate):
    existente = db.query(Empresa).filter(Empresa.ruc == datos.ruc).first()
    if existente:
        raise HTTPException(status_code=400, detail="RUC ya registrado")
    empresa = Empresa(**datos.model_dump())
    db.add(empresa)
    db.commit()
    db.refresh(empresa)
    return empresa

def listar_empresas(db: Session):
    return db.query(Empresa).all()

def obtener_empresa(db: Session, empresa_id: int):
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")
    return empresa