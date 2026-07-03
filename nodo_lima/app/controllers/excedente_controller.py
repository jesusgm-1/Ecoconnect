from sqlalchemy.orm import Session
from app.models.excedente import Excedente, EstadoExcedente
from app.models.transferencia import Transferencia
from app.views.excedente_schema import ExcedenteCreate
from datetime import datetime
from fastapi import HTTPException

def crear_excedente(db: Session, datos: ExcedenteCreate):
    excedente = Excedente(**datos.model_dump())
    db.add(excedente)
    db.commit()
    db.refresh(excedente)
    return excedente

def listar_excedentes(db: Session):
    return db.query(Excedente).filter(
        Excedente.estado == EstadoExcedente.disponible
    ).all()

def listar_todos_excedentes(db: Session):
    return db.query(Excedente).all()

def obtener_excedente(db: Session, excedente_id: int):
    excedente = db.query(Excedente).filter(Excedente.id == excedente_id).first()
    if not excedente:
        raise HTTPException(status_code=404, detail="Excedente no encontrado")
    return excedente

def listar_excedentes_por_empresa(db: Session, empresa_id: int):
    return db.query(Excedente).filter(Excedente.empresa_id == empresa_id).all()

def reclamar_excedente(db: Session, excedente_id: int, ong_id: int):
    excedente = obtener_excedente(db, excedente_id)
    if excedente.estado != EstadoExcedente.disponible:
        raise HTTPException(status_code=400, detail="El excedente no está disponible")
    excedente.estado = EstadoExcedente.bloqueado
    db.commit()
    db.refresh(excedente)
    return excedente

def confirmar_transferencia(db: Session, excedente_id: int, empresa_id: int):
    excedente = obtener_excedente(db, excedente_id)
    if excedente.empresa_id != empresa_id:
        raise HTTPException(status_code=403, detail="No autorizado")
    if excedente.estado != EstadoExcedente.bloqueado:
        raise HTTPException(status_code=400, detail="El excedente no está bloqueado")

    excedente.estado = EstadoExcedente.transferido

    transferencia = Transferencia(
        excedente_id=excedente_id,
        kg_transferidos=excedente.cantidad,
        estado="completada"
    )
    db.add(transferencia)
    db.commit()
    db.refresh(excedente)
    return excedente

def listar_transferencias(db: Session):
    return db.query(Transferencia).order_by(Transferencia.fecha_transferencia.desc()).all()

def verificar_vencidos(db: Session):
    ahora = datetime.utcnow()
    vencidos = db.query(Excedente).filter(
        Excedente.fecha_limite < ahora,
        Excedente.estado == EstadoExcedente.disponible
    ).all()
    for e in vencidos:
        e.estado = EstadoExcedente.vencido
    db.commit()
    return len(vencidos)