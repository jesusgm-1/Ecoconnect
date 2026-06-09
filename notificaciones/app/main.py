import threading
from app.consumers.excedente_consumer import iniciar_consumidor

def main():
    hilo = threading.Thread(target=iniciar_consumidor, daemon=True)
    hilo.start()
    print("[*] Servicio de notificaciones iniciado")
    hilo.join()

if __name__ == "__main__":
    main()