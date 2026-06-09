from fastapi import APIRouter
from app.services.router_service import reenviar_peticion

router = APIRouter(prefix="/empresas", tags=["Empresas"])

@router.get("/{region}")
async def listar(region: str):
    return await reenviar_peticion(region, "/empresas/", "GET")

@router.get("/{region}/{empresa_id}")
async def obtener(region: str, empresa_id: int):
    return await reenviar_peticion(region, f"/empresas/{empresa_id}", "GET")

@router.post("/{region}")
async def crear(region: str, datos: dict):
    return await reenviar_peticion(region, "/empresas/", "POST", datos)