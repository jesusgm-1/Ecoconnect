from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers import excedente_controller
from app.views.excedente_schema import ExcedenteCreate, ExcedenteResponse
from typing import List

router = APIRouter(prefix="/excedentes", tags=["Excedentes"])

@router.post("/", response_model=ExcedenteResponse)
def crear(datos: ExcedenteCreate, db: Session = Depends(get_db)):
    return excedente_controller.crear_excedente(db, datos)

@router.get("/", response_model=List[ExcedenteResponse])
def listar(db: Session = Depends(get_db)):
    return excedente_controller.listar_excedentes(db)

@router.get("/{excedente_id}", response_model=ExcedenteResponse)
def obtener(excedente_id: int, db: Session = Depends(get_db)):
    return excedente_controller.obtener_excedente(db, excedente_id)

@router.put("/{excedente_id}/reclamar", response_model=ExcedenteResponse)
def reclamar(excedente_id: int, ong_id: int, db: Session = Depends(get_db)):
    return excedente_controller.reclamar_excedente(db, excedente_id, ong_id)