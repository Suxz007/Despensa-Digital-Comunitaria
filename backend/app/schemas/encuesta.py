"""Modelos de la encuesta de usabilidad."""
from pydantic import BaseModel, Field


class RespuestasEncuesta(BaseModel):
    respuesta_1: int = Field(ge=1, le=5)
    respuesta_2: int = Field(ge=1, le=5)
    respuesta_3: int = Field(ge=1, le=5)
    respuesta_4: int = Field(ge=1, le=5)
    respuesta_5: int = Field(ge=1, le=5)


class RegistroEncuesta(BaseModel):
    subproyecto_id: str = Field(min_length=1, max_length=64)
    version_encuesta: int = Field(default=2, ge=1, le=65535)
    respuestas: RespuestasEncuesta

