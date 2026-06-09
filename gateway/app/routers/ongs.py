from fastapi import APIRouter
from app.services.router_service import reenviar_peticion

router = APIRouter(prefix="/ongs", tags=["ONGs"])

@router.get("/{region}")
async def listar(region: str):
    return await reenviar_peticion(region, "/ongs/", "GET")

@router.get("/{region}/{ong_id}")
async def obtener(region: str, ong_id: int):
    return await reenviar_peticion(region, f"/ongs/{ong_id}", "GET")

@router.post("/{region}")
async def crear(region: str, datos: dict):
    return await reenviar_peticion(region, "/ongs/", "POST", datos)

@router.put("/{region}/{ong_id}/verificar")
async def verificar(region: str, ong_id: int):
    return await reenviar_peticion(region, f"/ongs/{ong_id}/verificar", "PUT")