def notificar_ongs(mensaje: dict):
    print(f"[EMAIL] Enviando alerta a ONGs de {mensaje.get('region')}:")
    print(f"  Excedente disponible: {mensaje.get('tipo_recurso')}")
    print(f"  Cantidad: {mensaje.get('cantidad')} {mensaje.get('unidad')}")