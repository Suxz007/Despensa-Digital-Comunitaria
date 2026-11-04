"""Punto de entrada de la API. Arrancar con:  uvicorn app.main:app --port 9099"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import PORT
from app.db.sqlite import inicializar_bd_local
from app.routers import auth, encuestas, health, productos, solicitudes

app = FastAPI(title="Despensa Digital Comunitaria - Travesías")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

inicializar_bd_local()

app.include_router(auth.router)
app.include_router(encuestas.router)
app.include_router(productos.router)
app.include_router(solicitudes.router)
app.include_router(health.router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=PORT)
