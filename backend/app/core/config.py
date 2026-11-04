"""Configuración central: todo lo que viene de variables de entorno vive aquí."""
import os

# backend/  (dos niveles arriba de app/core/)
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# --- JWT ---
JWT_SECRET = os.getenv("JWT_SECRET", "clave-solo-para-pruebas")
JWT_ALGORITHM = "HS256"
JWT_EXPIRA_MINUTOS = 30

# --- MySQL remoto ---
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "100.79.246.82"),
    "port": int(os.getenv("DB_PORT", "3314")),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "despensa"),
}

# --- SQLite local de respaldo ---
LOCAL_SQLITE_PATH = os.getenv(
    "SQLITE_PATH", os.path.join(BACKEND_DIR, "data", "encuestas_local.db")
)

# --- Usuarios de respaldo si MySQL no está disponible ---
USUARIOS_RESPALDO_LOCAL = {
    "admin": {"credenciales": "Admin123", "estado": "comunidad"},
    "docente": {"credenciales": "Docente123", "estado": "comunidad"},
    "estudiante": {"credenciales": "Estudiante123", "estado": "comunidad"},
}

PORT = int(os.getenv("PORT", 8000))
