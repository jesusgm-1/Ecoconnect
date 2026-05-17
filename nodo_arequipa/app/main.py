import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.models import excedente, empresa, ong, transferencia
from app.routers import excedente_router, empresa_router, ong_router

load_dotenv()
REGION = os.getenv("REGION", "lima")

Base.metadata.create_all(bind=engine)

app = FastAPI(title=f"Eco-Connect — Nodo {REGION.capitalize()}", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(excedente_router.router)
app.include_router(empresa_router.router)
app.include_router(ong_router.router)

@app.get("/")
def root():
    return {"nodo": REGION, "status": "activo"}

@app.get("/health")
def health():
    return {"status": "ok", "region": REGION}