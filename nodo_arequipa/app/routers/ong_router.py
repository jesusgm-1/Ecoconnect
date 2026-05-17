from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers import ong_controller
from app.views.ong_schema import ONGCreate, ONGResponse
from typing import List

router = APIRouter(prefix="/ongs", tags=["ONGs"])

@router.post("/", response_model=ONGResponse)
def crear(datos: ONGCreate, db: Session = Depends(get_db)):
    return ong_controller.crear_ong(db, datos)

@router.get("/", response_model=List[ONGResponse])
def listar(db: Session = Depends(get_db)):
    return ong_controller.listar_ongs(db)

@router.get("/{ong_id}", response_model=ONGResponse)
def obtener(ong_id: int, db: Session = Depends(get_db)):
    return ong_controller.obtener_ong(db, ong_id)

@router.put("/{ong_id}/verificar", response_model=ONGResponse)
def verificar(ong_id: int, db: Session = Depends(get_db)):
    return ong_controller.verificar_ong(db, ong_id)