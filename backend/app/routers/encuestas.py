import sqlite3
from typing import Optional

import mysql.connector
from fastapi import APIRouter, Header, HTTPException, status

from app.db.mysql import obtener_conexion_mysql
from app.db.sqlite import conectar_sqlite
from app.schemas.encuesta import RegistroEncuesta
from app.services.auth import autenticacion

router = APIRouter(prefix="/api/v1/encuestas/usabilidad", tags=["encuestas"])


@router.post("", status_code=status.HTTP_201_CREATED)
def registrar_encuesta(
    registro: RegistroEncuesta,
    authorization: Optional[str] = Header(default=None),
):
    try:
        usuario_id = autenticacion.validar_token(authorization)
    except Exception:
        usuario_id = "usuario_comunitario"

    r = registro.respuestas

    if registro.version_encuesta >= 2:
        valores = [r.respuesta_1, r.respuesta_2, r.respuesta_3, r.respuesta_4, r.respuesta_5]
        if any(v < 1 or v > 3 for v in valores):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Las respuestas de la versión 2 deben ser 1 (Malo), 2 (Medio) o 3 (Excelente).",
            )

    # 1. Intentar persistir en MySQL si está disponible
    try:
        conn_mysql = obtener_conexion_mysql()
        cur_mysql = conn_mysql.cursor()
        cur_mysql.execute(
            """
            CREATE TABLE IF NOT EXISTS encuesta_usabilidad_respuestas (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                subproyecto_id VARCHAR(64) NOT NULL,
                usuario_id VARCHAR(128) NOT NULL,
                version_encuesta SMALLINT UNSIGNED NOT NULL DEFAULT 2,
                respuesta_1 TINYINT UNSIGNED NOT NULL,
                respuesta_2 TINYINT UNSIGNED NOT NULL,
                respuesta_3 TINYINT UNSIGNED NOT NULL,
                respuesta_4 TINYINT UNSIGNED NOT NULL,
                respuesta_5 TINYINT UNSIGNED NOT NULL,
                fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY uq_encuesta_usuario_subproyecto_version
                    (usuario_id, subproyecto_id, version_encuesta)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            """
        )
        cur_mysql.execute(
            """
            INSERT INTO encuesta_usabilidad_respuestas (
                subproyecto_id, usuario_id, version_encuesta,
                respuesta_1, respuesta_2, respuesta_3, respuesta_4, respuesta_5
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                registro.subproyecto_id,
                usuario_id,
                registro.version_encuesta,
                r.respuesta_1,
                r.respuesta_2,
                r.respuesta_3,
                r.respuesta_4,
                r.respuesta_5,
            ),
        )
        id_creado = int(cur_mysql.lastrowid)
        conn_mysql.commit()
        cur_mysql.close()
        conn_mysql.close()
        return {
            "id": id_creado,
            "subproyecto_id": registro.subproyecto_id,
            "version_encuesta": registro.version_encuesta,
            "guardado": True,
        }
    except mysql.connector.IntegrityError as exc:
        if exc.errno == 1062:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya respondiste esta versión de la encuesta en este subproyecto.",
            ) from exc
    except mysql.connector.Error as err:
        print(f"Aviso MySQL encuesta ({err}). Guardando en BD local SQLite.")

    # 2. Persistir en base de datos local SQLite
    conn_local = conectar_sqlite()
    try:
        cur = conn_local.cursor()
        cur.execute(
            """
            INSERT INTO encuesta_usabilidad_respuestas (
                subproyecto_id, usuario_id, version_encuesta,
                respuesta_1, respuesta_2, respuesta_3, respuesta_4, respuesta_5
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                registro.subproyecto_id,
                usuario_id,
                registro.version_encuesta,
                r.respuesta_1,
                r.respuesta_2,
                r.respuesta_3,
                r.respuesta_4,
                r.respuesta_5,
            ),
        )
        id_creado = int(cur.lastrowid)
        conn_local.commit()
    except sqlite3.IntegrityError as exc:
        conn_local.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya respondiste esta versión de la encuesta en este subproyecto.",
        ) from exc
    finally:
        conn_local.close()

    return {
        "id": id_creado,
        "subproyecto_id": registro.subproyecto_id,
        "version_encuesta": registro.version_encuesta,
        "guardado": True,
    }


@router.get("/resumen")
def resumen_encuestas(subproyecto_id: str = "despensa-digital"):
    conn_local = conectar_sqlite()
    conn_local.row_factory = sqlite3.Row
    try:
        cur = conn_local.cursor()
        cur.execute(
            """
            SELECT
                subproyecto_id,
                version_encuesta,
                COUNT(*) AS numero_respuestas,
                ROUND(AVG(respuesta_1), 2) AS aprendizaje,
                ROUND(AVG(respuesta_2), 2) AS navegacion,
                ROUND(AVG(respuesta_3), 2) AS claridad,
                ROUND(AVG(respuesta_4), 2) AS eficiencia_percibida,
                ROUND(AVG(respuesta_5), 2) AS satisfaccion,
                ROUND(AVG((respuesta_1 + respuesta_2 + respuesta_3 + respuesta_4 + respuesta_5) / 5.0), 2) AS promedio_usabilidad
            FROM encuesta_usabilidad_respuestas
            WHERE subproyecto_id = ?
            GROUP BY subproyecto_id, version_encuesta
            """,
            (subproyecto_id,),
        )
        resumen = [dict(row) for row in cur.fetchall()]

        cur.execute(
            """
            SELECT id, subproyecto_id, usuario_id, version_encuesta,
                   respuesta_1, respuesta_2, respuesta_3, respuesta_4, respuesta_5, fecha_creacion
            FROM encuesta_usabilidad_respuestas
            WHERE subproyecto_id = ?
            ORDER BY fecha_creacion DESC
            """,
            (subproyecto_id,),
        )
        respuestas = [dict(row) for row in cur.fetchall()]

        return {"resumen": resumen, "respuestas": respuestas}
    finally:
        conn_local.close()

