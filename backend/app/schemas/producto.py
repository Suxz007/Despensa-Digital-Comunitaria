"""Modelos de productos."""
from typing import Optional

from pydantic import BaseModel


class ProductoIn(BaseModel):
    name: str
    category: str = "Alimentos"
    price: str
    unit: Optional[str] = "/ kg"
    presentation: Optional[str] = None
    imageUrl: Optional[str] = None
    description: Optional[str] = None
    available: bool = True
    productor_nombre: Optional[str] = "Comunidad Uniamazonia"

