from fastapi import APIRouter

from app.schemas.auth import LoginRequest
from app.services.auth import autenticacion

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login")
def login(datos: LoginRequest):
    return autenticacion.login(datos.nombre_usuario, datos.credenciales)
