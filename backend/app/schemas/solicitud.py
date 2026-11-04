"""Modelos de solicitudes de compra/contacto."""
from typing import Optional

from pydantic import BaseModel


class SolicitudIn(BaseModel):
    nombre_completo: str
    telefono: str
    correo: Optional[str] = None
    tipo_solicitante: Optional[str] = "Comunidad Universitaria"
    id_producto: int
    cantidad_solicitada: Optional[int] = 1
    mensaje: Optional[str] = None

