import os
import sqlite3
from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
import mysql.connector
from fastapi import FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


app = FastAPI(title="API Comunidad y Encuestas - Travesías")


# ============================================
# CORS
# ============================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# CONFIGURACIÓN JWT
# ============================================
JWT_SECRET = os.getenv(
    "JWT_SECRET",
    "clave-solo-para-pruebas"
)

JWT_ALGORITHM = "HS256"
JWT_EXPIRA_MINUTOS = 30


# ============================================
# CONFIGURACIÓN MYSQL Y BASE DE DATOS LOCAL
# ============================================
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "100.79.246.82"),
    "port": int(os.getenv("DB_PORT", "3314")),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "bad9ojpsbsednmido0hy"),
}

LOCAL_SQLITE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "encuestas_local.db")

# Usuarios locales de respaldo (según la tabla del coordinador)
USUARIOS_RESPALDO_LOCAL = {
    "admin": {"credenciales": "Admin123", "estado": "comunidad"},
    "docente": {"credenciales": "Docente123", "estado": "comunidad"},
    "estudiante": {"credenciales": "Estudiante123", "estado": "comunidad"},
}


def inicializar_bd_local():
    """Inicializa la tabla de encuestas en SQLite local siguiendo esquema_mysql.sql."""
    conn = sqlite3.connect(LOCAL_SQLITE_PATH)
    try:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS encuesta_usabilidad_respuestas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                subproyecto_id TEXT NOT NULL,
                usuario_id TEXT NOT NULL,
                version_encuesta INTEGER NOT NULL DEFAULT 2,
                respuesta_1 INTEGER NOT NULL,
                respuesta_2 INTEGER NOT NULL,
                respuesta_3 INTEGER NOT NULL,
                respuesta_4 INTEGER NOT NULL,
                respuesta_5 INTEGER NOT NULL,
                fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (usuario_id, subproyecto_id, version_encuesta)
            )
            """
        )
        conn.commit()
    finally:
        conn.close()


inicializar_bd_local()


# ============================================
# MODELOS
# ============================================
class LoginRequest(BaseModel):
    nombre_usuario: str
    credenciales: str


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


# ============================================
# AUTENTICACIÓN
# ============================================
class Autenticacion:

    # ----------------------------------------
    # Conectar a MySQL
    # ----------------------------------------
    def conectar(self):
        return mysql.connector.connect(**DB_CONFIG, connection_timeout=4)

    # ----------------------------------------
    # Generar JWT
    # ----------------------------------------
    def generar_token(self, nombre_usuario: str) -> str:
        ahora = datetime.now(timezone.utc)

        payload = {
            "sub": nombre_usuario,
            "iat": ahora,
            "exp": ahora + timedelta(
                minutes=JWT_EXPIRA_MINUTOS
            ),
        }

        return jwt.encode(
            payload,
            JWT_SECRET,
            algorithm=JWT_ALGORITHM
        )

    # ----------------------------------------
    # Validar JWT desde Header Authorization
    # ----------------------------------------
    def validar_token(self, authorization: Optional[str]) -> str:
        if not authorization or not authorization.lower().startswith("bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Tu sesión no está disponible. Inicia sesión nuevamente.",
            )
        token = authorization.split(" ", 1)[1].strip()
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Tu sesión no está disponible. Inicia sesión nuevamente.",
            )
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            usuario_id = payload.get("sub")
            if not usuario_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token sin identificador de usuario.",
                )
            return str(usuario_id)
        except jwt.ExpiredSignatureError as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Tu sesión expiró. Inicia sesión nuevamente.",
            ) from exc
        except jwt.PyJWTError as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token de sesión inválido.",
            ) from exc

    # ----------------------------------------
    # Iniciar sesión
    # ----------------------------------------
    def login(
        self,
        nombre_usuario: str,
        credenciales: str
    ):
        conexion = None
        cursor = None
        usuario_bd = None

        try:
            conexion = self.conectar()
            cursor = conexion.cursor(dictionary=True)

            sql = """
                SELECT
                    nombre_usuario,
                    credenciales,
                    estado
                FROM usuario
                WHERE nombre_usuario = %s
                LIMIT 1
            """

            cursor.execute(sql, (nombre_usuario,))
            usuario_bd = cursor.fetchone()

        except mysql.connector.Error as error:
            print(f"Aviso MySQL remoto no disponible ({error}). Usando validación local de respaldo.")
            if nombre_usuario in USUARIOS_RESPALDO_LOCAL:
                datos_locales = USUARIOS_RESPALDO_LOCAL[nombre_usuario]
                usuario_bd = {
                    "nombre_usuario": nombre_usuario,
                    "credenciales": datos_locales["credenciales"],
                    "estado": datos_locales["estado"],
                }

        finally:
            if cursor is not None:
                cursor.close()

            if (
                conexion is not None
                and conexion.is_connected()
            ):
                conexion.close()

        # Validar usuario y contraseña
        if (
            usuario_bd is None
            or usuario_bd["credenciales"] != credenciales
        ):
            raise HTTPException(
                status_code=401,
                detail="Usuario o contraseña incorrectos"
            )

        # Validar acceso a la comunidad
        if usuario_bd["estado"] != "comunidad":
            raise HTTPException(
                status_code=403,
                detail="Usuario sin acceso a la comunidad"
            )

        # Generar un único token
        token = self.generar_token(
            usuario_bd["nombre_usuario"]
        )

        # Respuesta compatible con el dashboard
        # y con el mecanismo de parámetros de Flutter
        return {
            "nombre_usuario": usuario_bd["nombre_usuario"],
            "access_token": token,

            "usuario": usuario_bd["nombre_usuario"],
            "token": token,

            "token_type": "bearer",
            "expires_in": JWT_EXPIRA_MINUTOS * 60,
        }


# Crear instancia del servicio
autenticacion = Autenticacion()


# ============================================
# ENDPOINTS DE AUTENTICACIÓN
# ============================================

@app.post("/api/auth/login")
def login(datos: LoginRequest):
    return autenticacion.login(
        datos.nombre_usuario,
        datos.credenciales
    )


# ============================================
# ENDPOINTS DEL MÓDULO DE ENCUESTA DE USABILIDAD
# (Contrato oficial: POST /api/v1/encuestas/usabilidad)
# ============================================

@app.post("/api/v1/encuestas/usabilidad", status_code=status.HTTP_201_CREATED)
def registrar_encuesta(
    registro: RegistroEncuesta,
    authorization: Optional[str] = Header(default=None),
):
    usuario_id = autenticacion.validar_token(authorization)
    r = registro.respuestas

    # En versión 2 la escala oficial de caritas es 1 (😡 Malo), 2 (😬 Medio), 3 (🤩 Excelente)
    if registro.version_encuesta >= 2:
        valores = [r.respuesta_1, r.respuesta_2, r.respuesta_3, r.respuesta_4, r.respuesta_5]
        if any(v < 1 or v > 3 for v in valores):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Las respuestas de la versión 2 deben ser 1 (Malo), 2 (Medio) o 3 (Excelente).",
            )

    # 1. Intentar guardar también en MySQL si está accesible
    try:
        conn_mysql = autenticacion.conectar()
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

    # 2. Guardar en la Base de Datos Local SQLite (indicada por el coordinador)
    conn_local = sqlite3.connect(LOCAL_SQLITE_PATH)
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


@app.get("/api/v1/encuestas/usabilidad/resumen")
def resumen_encuestas(subproyecto_id: str = "despensa-digital"):
    """Consulta el promedio y listado de respuestas de la encuesta para el subproyecto."""
    conn_local = sqlite3.connect(LOCAL_SQLITE_PATH)
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


# Comprobar que la API está funcionando
@app.get("/")
def inicio():
    return {
        "mensaje": "API funcionando correctamente"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
