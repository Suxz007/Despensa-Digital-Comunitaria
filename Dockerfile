# ==============================================================================
# Dockerfile para Despensa Digital Comunitaria - Travesías
# Puerto oficial asignado: 8090
# ==============================================================================

FROM python:3.11-slim

# Evitar generación de archivos .pyc y asegurar logs en tiempo real
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8090

WORKDIR /app

# Instalar dependencias del sistema mínimas si fueran necesarias
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código fuente completo del proyecto
COPY . .

# Exponer el puerto del subproyecto
EXPOSE 8090

# Comprobación de salud del contenedor
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8090/api/health || exit 1

# Iniciar la aplicación en el puerto 8090
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8090"]

