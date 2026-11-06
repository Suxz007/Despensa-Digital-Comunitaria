from datetime import datetime, timezone

from fastapi import APIRouter

from app.core.config import DB_CONFIG, PORT
from app.db.mysql import obtener_conexion_mysql

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health")
def healthcheck():
    estado_bd = {"conectado": False, "base_datos": DB_CONFIG.get("database")}
    try:
        conn = obtener_conexion_mysql()
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM producto")
        total_productos = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM encuesta_usabilidad_respuestas")
        total_encuestas = cur.fetchone()[0]
        cur.close()
        conn.close()
        estado_bd = {
            "conectado": True,
            "motor": "MySQL",
            "puerto_bd": DB_CONFIG.get("port"),
            "base_datos": DB_CONFIG.get("database"),
            "total_productos_guardados": total_productos,
            "total_encuestas_guardadas": total_encuestas,
        }
    except Exception as exc:
        estado_bd["error"] = str(exc)

    return {
        "status": "ok",
        "servicio": "Despensa Digital Comunitaria",
        "puerto": PORT,
        "base_de_datos": estado_bd,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
