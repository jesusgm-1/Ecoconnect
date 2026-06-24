from fastapi import APIRouter
from app.services.router_service import reenviar_peticion

router = APIRouter(prefix="/auth", tags=["Autenticacion"])

@router.post("/{region}/login")
async def login(region: str, datos: dict):
    return await reenviar_peticion(region, "/auth/login", "POST", datos)

@router.post("/{region}/registro")
async def registro(region: str, datos: dict):
    return await reenviar_peticion(region, "/auth/registro", "POST", datos)
