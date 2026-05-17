from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers import empresa_controller
from app.views.empresa_schema import EmpresaCreate, EmpresaResponse
from typing import List

router = APIRouter(prefix="/empresas", tags=["Empresas"])

@router.post("/", response_model=EmpresaResponse)
def crear(datos: EmpresaCreate, db: Session = Depends(get_db)):
    return empresa_controller.crear_empresa(db, datos)

@router.get("/", response_model=List[EmpresaResponse])
def listar(db: Session = Depends(get_db)):
    return empresa_controller.listar_empresas(db)

@router.get("/{empresa_id}", response_model=EmpresaResponse)
def obtener(empresa_id: int, db: Session = Depends(get_db)):
    return empresa_controller.obtener_empresa(db, empresa_id)