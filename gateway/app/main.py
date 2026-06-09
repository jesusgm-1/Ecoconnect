import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import excedentes
from app.routers import excedentes, empresas, ongs

load_dotenv()

app = FastAPI(title="Eco-Connect — Gateway Central", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(excedentes.router)
app.include_router(empresas.router)
app.include_router(ongs.router)

@app.get("/")
def root():
    return {"servicio": "Gateway Central", "status": "activo"}

@app.get("/health")
def health():
    return {"status": "ok", "nodos": ["lima", "arequipa", "trujillo"]}