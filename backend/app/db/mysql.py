"""Conexión a MySQL remoto (base 'despensa')."""
import mysql.connector

from app.core.config import DB_CONFIG


def obtener_conexion_mysql():
    try:
        return mysql.connector.connect(**DB_CONFIG, connection_timeout=3)
    except Exception:
        alt_host = "172.27.30.205" if DB_CONFIG.get("host") != "172.27.30.205" else "100.79.246.82"
        alt_config = {**DB_CONFIG, "host": alt_host}
        return mysql.connector.connect(**alt_config, connection_timeout=3)
