from sqlalchemy.orm import Session
from app.models.ong import ONG
from app.views.ong_schema import ONGCreate
from fastapi import HTTPException

def crear_ong(db: Session, datos: ONGCreate):
    existente = db.query(ONG).filter(ONG.email == datos.email).first()
    if existente:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    ong = ONG(**datos.model_dump())
    db.add(ong)
    db.commit()
    db.refresh(ong)
    return ong

def listar_ongs(db: Session):
    return db.query(ONG).all()

def obtener_ong(db: Session, ong_id: int):
    ong = db.query(ONG).filter(ONG.id == ong_id).first()
    if not ong:
        raise HTTPException(status_code=404, detail="ONG no encontrada")
    return ong

def verificar_ong(db: Session, ong_id: int):
    ong = obtener_ong(db, ong_id)
    ong.verificada = True
    db.commit()
    db.refresh(ong)
    return ong