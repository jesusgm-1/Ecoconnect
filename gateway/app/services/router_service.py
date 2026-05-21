import httpx
import os
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

NODOS = {
    "lima": os.getenv("NODO_LIMA"),
    "arequipa": os.getenv("NODO_AREQUIPA"),
    "trujillo": os.getenv("NODO_TRUJILLO"),
}

async def reenviar_peticion(region: str, path: str, method: str, data: dict = None):
    url_nodo = NODOS.get(region.lower())
    if not url_nodo:
        raise HTTPException(status_code=400, detail=f"Región '{region}' no válida")
    
    url = f"{url_nodo}{path}"
    
    async with httpx.AsyncClient() as client:
        try:
            if method == "GET":
                response = await client.get(url)
            elif method == "POST":
                response = await client.post(url, json=data)
            elif method == "PUT":
                response = await client.put(url, json=data)
            return response.json()
        except httpx.ConnectError:
            raise HTTPException(
                status_code=503,
                detail=f"Nodo {region} no disponible (Circuit Breaker activo)"
            )