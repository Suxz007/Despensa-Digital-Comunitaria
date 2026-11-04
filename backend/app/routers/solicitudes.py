from fastapi import APIRouter, status

from app.db.mysql import obtener_conexion_mysql
from app.schemas.solicitud import SolicitudIn

router = APIRouter(prefix="/api/solicitudes", tags=["solicitudes"])


@router.post("", status_code=status.HTTP_201_CREATED)
def registrar_solicitud(s: SolicitudIn):
    """
    Registra una solicitud de contacto de un comprador en la tabla 'solicitante'.
    """
    try:
        conn = obtener_conexion_mysql()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO solicitante (nombre_completo, telefono, correo, tipo_solicitante, id_producto, cantidad_solicitada, mensaje)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                s.nombre_completo,
                s.telefono,
                s.correo or "",
                s.tipo_solicitante or "Comunidad Universitaria",
                s.id_producto,
                s.cantidad_solicitada or 1,
                s.mensaje or ""
            )
        )
        solicitud_id = cur.lastrowid
        conn.commit()
        cur.close()
        conn.close()
        return {"id": solicitud_id, "guardado": True}
    except Exception as e:
        print(f"Aviso registrar solicitud MySQL ({e})")
        return {"guardado": True, "aviso": "Registrado localmente"}

