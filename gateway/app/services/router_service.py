import httpx
import pika
import json
import os
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

NODOS = {
    "lima": os.getenv("NODO_LIMA"),
    "arequipa": os.getenv("NODO_AREQUIPA"),
    "trujillo": os.getenv("NODO_TRUJILLO"),
}

def publicar_evento(mensaje: dict):
    try:
        url = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
        params = pika.URLParameters(url)
        connection = pika.BlockingConnection(params)
        channel = connection.channel()
        channel.queue_declare(queue="excedentes_nuevos", durable=True)
        channel.basic_publish(
            exchange="",
            routing_key="excedentes_nuevos",
            body=json.dumps(mensaje),
            properties=pika.BasicProperties(delivery_mode=2)
        )
        connection.close()
        print(f"[RabbitMQ] Evento publicado: {mensaje}")
    except Exception as e:
        print(f"[RabbitMQ] Error publicando evento: {e}")

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
                if "/excedentes/" in path and response.status_code == 200:
                    if data:
                        data["region"] = region
                        publicar_evento(data)
            elif method == "PUT":
                response = await client.put(url, json=data)
            return response.json()
        except httpx.ConnectError:
            raise HTTPException(
                status_code=503,
                detail=f"Nodo {region} no disponible (Circuit Breaker activo)"
            )