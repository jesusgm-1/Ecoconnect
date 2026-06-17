from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.usuario import Usuario
from app.views.auth_schema import RegistroRequest, LoginRequest, TokenResponse
from app.utils.auth import hashear_password, verificar_password, crear_token

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/registro", response_model=TokenResponse)
def registro(datos: RegistroRequest, db: Session = Depends(get_db)):
    existente = db.query(Usuario).filter(Usuario.email == datos.email).first()
    if existente:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    usuario = Usuario(
        email=datos.email,
        password_hash=hashear_password(datos.password),
        rol=datos.rol,
        region=datos.region,
        empresa_id=datos.empresa_id,
        ong_id=datos.ong_id
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    token = crear_token({"sub": usuario.email, "rol": usuario.rol, "region": usuario.region})
    return TokenResponse(access_token=token, rol=usuario.rol, region=usuario.region)

@router.post("/login", response_model=TokenResponse)
def login(datos: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == datos.email).first()
    if not usuario or not verificar_password(datos.password, usuario.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    token = crear_token({"sub": usuario.email, "rol": usuario.rol, "region": usuario.region})
    return TokenResponse(access_token=token, rol=usuario.rol, region=usuario.region)