from datetime import datetime, timezone

from fastapi import APIRouter

from app.core.config import PORT

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health")
def healthcheck():
    return {
        "status": "ok",
        "servicio": "Despensa Digital Comunitaria",
        "puerto": PORT,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
