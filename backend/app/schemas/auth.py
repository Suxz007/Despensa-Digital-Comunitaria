"""Modelos de login."""
from pydantic import BaseModel


class LoginRequest(BaseModel):
    nombre_usuario: str
    credenciales: str

