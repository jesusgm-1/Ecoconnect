from fastapi import APIRouter
from app.services.router_service import reenviar_peticion

router = APIRouter(prefix="/excedentes", tags=["Excedentes"])

@router.get("/{region}")
async def listar(region: str):
    return await reenviar_peticion(region, "/excedentes/", "GET")

@router.get("/{region}/{excedente_id}")
async def obtener(region: str, excedente_id: int):
    return await reenviar_peticion(region, f"/excedentes/{excedente_id}", "GET")

@router.get("/{region}/empresa/{empresa_id}")
async def listar_por_empresa(region: str, empresa_id: int):
    return await reenviar_peticion(region, f"/excedentes/empresa/{empresa_id}", "GET")

@router.post("/{region}")
async def crear(region: str, datos: dict):
    return await reenviar_peticion(region, "/excedentes/", "POST", datos)

@router.put("/{region}/{excedente_id}/reclamar")
async def reclamar(region: str, excedente_id: int, ong_id: int):
    return await reenviar_peticion(
        region, f"/excedentes/{excedente_id}/reclamar?ong_id={ong_id}", "PUT"
    )

@router.put("/{region}/{excedente_id}/confirmar")
async def confirmar(region: str, excedente_id: int, empresa_id: int):
    return await reenviar_peticion(
        region, f"/excedentes/{excedente_id}/confirmar?empresa_id={empresa_id}", "PUT"
    )