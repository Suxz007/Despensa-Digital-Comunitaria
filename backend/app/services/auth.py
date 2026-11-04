"""Lógica de autenticación: login contra MySQL (con respaldo local) y JWT."""
from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
import mysql.connector
from fastapi import HTTPException, status

from app.core.config import (
    JWT_ALGORITHM,
    JWT_EXPIRA_MINUTOS,
    JWT_SECRET,
    USUARIOS_RESPALDO_LOCAL,
)
from app.db.mysql import obtener_conexion_mysql


class Autenticacion:

    def conectar(self):
        return obtener_conexion_mysql()

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
