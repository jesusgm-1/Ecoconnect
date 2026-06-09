import pika
import json
import os
from dotenv import load_dotenv

load_dotenv()

def callback(ch, method, properties, body):
    mensaje = json.loads(body)
    print(f"[NOTIFICACIÓN] Nuevo excedente publicado:")
    print(f"  Tipo: {mensaje.get('tipo_recurso')}")
    print(f"  Cantidad: {mensaje.get('cantidad')} {mensaje.get('unidad')}")
    print(f"  Región: {mensaje.get('region')}")
    print(f"  Ubicación: {mensaje.get('ubicacion')}")
    ch.basic_ack(delivery_tag=method.delivery_tag)

def iniciar_consumidor():
    url = os.getenv("RABBITMQ_URL")
    params = pika.URLParameters(url)
    connection = pika.BlockingConnection(params)
    channel = connection.channel()
    channel.queue_declare(queue="excedentes_nuevos", durable=True)
    channel.basic_consume(queue="excedentes_nuevos", on_message_callback=callback)
    print("[*] Esperando mensajes de nuevos excedentes...")
    channel.start_consuming()