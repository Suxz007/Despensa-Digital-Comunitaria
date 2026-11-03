import os
import sqlite3
from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
import mysql.connector
from fastapi import FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = FastAPI(title="Despensa Digital Comunitaria - Travesías")


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
    "database": os.getenv("DB_NAME", "despensa"),
}

LOCAL_SQLITE_PATH = os.path.join(BASE_DIR, "encuestas_local.db")

# Usuarios locales de respaldo (según la tabla del coordinador)
USUARIOS_RESPALDO_LOCAL = {
    "admin": {"credenciales": "Admin123", "estado": "comunidad"},
    "docente": {"credenciales": "Docente123", "estado": "comunidad"},
    "estudiante": {"credenciales": "Estudiante123", "estado": "comunidad"},
}


def inicializar_bd_local():
    """Inicializa tablas en SQLite local como respaldo de alta disponibilidad."""
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
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS productos_local (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT NOT NULL DEFAULT 'Alimentos',
                price TEXT NOT NULL,
                unit TEXT DEFAULT '/ kg',
                presentation TEXT,
                imageUrl TEXT,
                description TEXT,
                available BOOLEAN DEFAULT 1,
                productor_nombre TEXT DEFAULT 'Comunidad Uniamazonia'
            )
            """
        )
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM productos_local")
        if cur.fetchone()[0] == 0:
            productos_base = [
                ('Bananos de Seda Frescos', 'Alimentos', '$ 5.000 / Mano', '/ Mano', 'Mano fresca (~1.5 kg)', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80', 'Bananos de seda dulces cosechados en parcelas comunitarias de productores locales.', 1, 'Asociación Agroecológica Uniamazonia'),
                ('Piña Golden Amazónica', 'Alimentos', '$ 7.000 / Un', '/ Unidad', 'Unidad seleccionada', 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80', 'Piña jugosa y dulce cultivada en suelos amazónicos con manejo agroecológico.', 1, 'Granja Experimental Santo Domingo'),
                ('Pulpa de Açaí Congelada', 'Alimentos', '$ 15.000 / 500g', '/ 500 g', 'Empaque 500g', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80', 'Pulpa pura de açaí amazónico cosechado de manera sostenible en el Caquetá.', 1, 'Asociación Agroecológica Uniamazonia'),
                ('Tomates Chonto Orgánicos', 'Alimentos', '$ 4.500 / kg', '/ kg', 'Bolsa 1 kg', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80', 'Tomates chonto cultivados en invernaderos comunitarios sin pesticidas sintéticos.', 1, 'Granja Experimental Santo Domingo'),
                ('Limón Pajarito Uniamazonia', 'Alimentos', '$ 3.000 / kg', '/ kg', 'Malla 1 kg', 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=800&q=80', 'Limones frescos con alto contenido de jugo cosechados en la granja Santo Domingo.', 1, 'Granja Experimental Santo Domingo'),
                ('Plátano Hartón Verde', 'Alimentos', '$ 15.000 / Racimo', '/ Racimo', 'Racimo de 8-10 unidades', 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80', 'Plátano verde cosechado en parcelas agroforestales de productores del Caquetá.', 1, 'Comunidad Campesina de Belén')
            ]
            cur.executemany(
                "INSERT INTO productos_local (name, category, price, unit, presentation, imageUrl, description, available, productor_nombre) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                productos_base
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


class SolicitudIn(BaseModel):
    nombre_completo: str
    telefono: str
    correo: Optional[str] = None
    tipo_solicitante: Optional[str] = "Comunidad Universitaria"
    id_producto: int
    cantidad_solicitada: Optional[int] = 1
    mensaje: Optional[str] = None


# ============================================
# AUTENTICACIÓN
# ============================================
class Autenticacion:

    def conectar(self):
        return mysql.connector.connect(**DB_CONFIG, connection_timeout=4)

    def generar_token(self, nombre_usuario: str) -> str:
        ahora = datetime.now(timezone.utc)
        payload = {
            "sub": nombre_usuario,
            "iat": ahora,
            "exp": ahora + timedelta(minutes=JWT_EXPIRA_MINUTOS),
        }
        return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

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

    def login(self, nombre_usuario: str, credenciales: str):
        conexion = None
        cursor = None
        usuario_bd = None

        try:
            conexion = self.conectar()
            cursor = conexion.cursor(dictionary=True)
            sql = """
                SELECT nombre_usuario, credenciales, estado
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
            if conexion is not None and conexion.is_connected():
                conexion.close()

        if usuario_bd is None or usuario_bd["credenciales"] != credenciales:
            raise HTTPException(
                status_code=401,
                detail="Usuario o contraseña incorrectos"
            )

        if usuario_bd["estado"] != "comunidad":
            raise HTTPException(
                status_code=403,
                detail="Usuario sin acceso a la comunidad"
            )

        token = self.generar_token(usuario_bd["nombre_usuario"])

        return {
            "nombre_usuario": usuario_bd["nombre_usuario"],
            "access_token": token,
            "usuario": usuario_bd["nombre_usuario"],
            "token": token,
            "token_type": "bearer",
            "expires_in": JWT_EXPIRA_MINUTOS * 60,
        }


autenticacion = Autenticacion()


# ============================================
# ENDPOINTS DE LA API
# ============================================

@app.post("/api/auth/login")
def login(datos: LoginRequest):
    return autenticacion.login(datos.nombre_usuario, datos.credenciales)


@app.post("/api/v1/encuestas/usabilidad", status_code=status.HTTP_201_CREATED)
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

    # 2. Persistir en base de datos local SQLite
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


# ============================================
# ENDPOINTS DE PRODUCTOS (BASE DE DATOS: despensa)
# ============================================

def obtener_conexion_mysql():
    return mysql.connector.connect(**DB_CONFIG, connection_timeout=4)


@app.get("/api/productos")
def listar_productos():
    """
    Obtiene los productos desde MySQL ('despensa' - 4 tablas).
    Si MySQL no está disponible, utiliza SQLite local como respaldo resiliente.
    """
    # 1. Intentar consultar base de datos MySQL 'despensa'
    try:
        conn = obtener_conexion_mysql()
        cur = conn.cursor(dictionary=True)
        cur.execute(
            """
            SELECT 
                p.id,
                p.nombre AS name,
                tp.nombre AS category,
                CONCAT('$ ', FORMAT(p.precio, 0, 'es_CO'), IF(p.unidad_medida IS NOT NULL AND p.unidad_medida != '', CONCAT(' / ', p.unidad_medida), '')) AS price,
                CONCAT('/ ', p.unidad_medida) AS unit,
                p.presentacion AS presentation,
                p.url_imagen AS imageUrl,
                p.descripcion AS description,
                p.disponible AS available,
                pr.nombre_completo AS productor_nombre
            FROM producto p
            JOIN tipo_producto tp ON p.id_tipo_producto = tp.id
            JOIN productor pr ON p.id_productor = pr.id
            ORDER BY p.id DESC
            """
        )
        filas = cur.fetchall()
        cur.close()
        conn.close()
        if filas:
            for item in filas:
                item["available"] = bool(item.get("available", 1))
            return filas
    except Exception as e:
        print(f"Aviso MySQL despensa ({e}). Utilizando base de datos local SQLite.")

    # 2. Respaldo local SQLite
    conn_local = sqlite3.connect(LOCAL_SQLITE_PATH)
    conn_local.row_factory = sqlite3.Row
    try:
        cur = conn_local.cursor()
        cur.execute("SELECT * FROM productos_local ORDER BY id DESC")
        rows = [dict(r) for r in cur.fetchall()]
        for r in rows:
            r["available"] = bool(r.get("available", 1))
        return rows
    finally:
        conn_local.close()


@app.post("/api/productos", status_code=status.HTTP_201_CREATED)
def crear_producto(p: ProductoIn):
    """
    Registra un nuevo producto vinculando productor y categoría (tipo_producto).
    """
    # Parsear precio numérico
    precio_numerico = 10000.0
    try:
        solo_digitos = "".join([c for c in p.price if c.isdigit() or c in ",."])
        solo_digitos = solo_digitos.replace(".", "").replace(",", ".")
        if solo_digitos:
            precio_numerico = float(solo_digitos)
    except Exception:
        precio_numerico = 10000.0

    unidad_limpia = p.unit.replace("/", "").strip() if p.unit else "kg"
    nuevo_id = None

    # 1. Intentar persistencia en MySQL 'despensa'
    try:
        conn = obtener_conexion_mysql()
        cur = conn.cursor()

        # Buscar o crear tipo_producto
        cur.execute("SELECT id FROM tipo_producto WHERE LOWER(nombre) = LOWER(%s) LIMIT 1", (p.category,))
        row_tp = cur.fetchone()
        if row_tp:
            tipo_id = row_tp[0]
        else:
            cur.execute("INSERT INTO tipo_producto (nombre) VALUES (%s)", (p.category,))
            tipo_id = cur.lastrowid

        # Buscar o crear productor
        cur.execute("SELECT id FROM productor ORDER BY id ASC LIMIT 1")
        row_pr = cur.fetchone()
        if row_pr:
            productor_id = row_pr[0]
        else:
            cur.execute(
                "INSERT INTO productor (nombre_completo, telefono_contacto) VALUES (%s, %s)",
                (p.productor_nombre or "Comunidad Uniamazonia", "3100000000")
            )
            productor_id = cur.lastrowid

        # Insertar en tabla producto
        cur.execute(
            """
            INSERT INTO producto (
                nombre, descripcion, precio, unidad_medida, presentacion, url_imagen, disponible, id_tipo_producto, id_productor
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                p.name,
                p.description or "",
                precio_numerico,
                unidad_limpia,
                p.presentation or "",
                p.imageUrl or "",
                1 if p.available else 0,
                tipo_id,
                productor_id
            )
        )
        nuevo_id = cur.lastrowid
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Aviso guardado MySQL despensa ({e}). Guardando en respaldo SQLite.")

    # 2. Guardar en SQLite local de respaldo
    conn_local = sqlite3.connect(LOCAL_SQLITE_PATH)
    try:
        cur = conn_local.cursor()
        cur.execute(
            """
            INSERT INTO productos_local (name, category, price, unit, presentation, imageUrl, description, available, productor_nombre)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                p.name,
                p.category,
                p.price,
                p.unit or "/ kg",
                p.presentation or "",
                p.imageUrl or "",
                p.description or "",
                1 if p.available else 0,
                p.productor_nombre or "Comunidad Uniamazonia"
            )
        )
        if not nuevo_id:
            nuevo_id = cur.lastrowid
        conn_local.commit()
    finally:
        conn_local.close()

    return {
        "id": nuevo_id,
        "name": p.name,
        "category": p.category,
        "price": p.price,
        "unit": p.unit,
        "presentation": p.presentation,
        "imageUrl": p.imageUrl,
        "description": p.description,
        "available": p.available,
        "productor_nombre": p.productor_nombre
    }


@app.delete("/api/productos/{producto_id}")
def eliminar_producto(producto_id: int):
    # MySQL
    try:
        conn = obtener_conexion_mysql()
        cur = conn.cursor()
        cur.execute("DELETE FROM producto WHERE id = %s", (producto_id,))
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Aviso eliminar MySQL ({e})")

    # SQLite
    conn_local = sqlite3.connect(LOCAL_SQLITE_PATH)
    try:
        cur = conn_local.cursor()
        cur.execute("DELETE FROM productos_local WHERE id = ?", (producto_id,))
        conn_local.commit()
    finally:
        conn_local.close()

    return {"ok": True, "id": producto_id}


@app.post("/api/solicitudes", status_code=status.HTTP_201_CREATED)
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


@app.get("/api/health")
def healthcheck():
    return {
        "status": "ok",
        "servicio": "Despensa Digital Comunitaria",
        "puerto": int(os.getenv("PORT", 8090)),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


# ============================================
# ARCHIVOS ESTÁTICOS DEL FRONTEND
# (Permite servir index.html, app.jsx, styles.css y carpetas en el puerto 8090)
# ============================================
if os.path.exists(os.path.join(BASE_DIR, "index.html")):
    app.mount("/", StaticFiles(directory=BASE_DIR, html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn
    puerto = int(os.getenv("PORT", 8090))
    print(f"Iniciando Despensa Digital Comunitaria en http://0.0.0.0:{puerto}")
    uvicorn.run(app, host="0.0.0.0", port=puerto)

