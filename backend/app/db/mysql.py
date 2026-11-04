"""Conexión a MySQL remoto (base 'despensa')."""
import mysql.connector

from app.core.config import DB_CONFIG


def obtener_conexion_mysql():
    return mysql.connector.connect(**DB_CONFIG, connection_timeout=4)
