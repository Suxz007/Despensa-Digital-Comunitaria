# Despensa Digital Comunitaria – Travesías

Marketplace comunitario de la Universidad de la Amazonia. **Backend y frontend van separados.**

```
DespensaDigitalComunitaria/
├── backend/                  API en Python (FastAPI)
│   ├── app/
│   │   ├── main.py           Arranque de la API (une todo)
│   │   ├── core/config.py    Variables de entorno (BD, JWT, puerto)
│   │   ├── db/               Conexiones: mysql.py y sqlite.py (respaldo local)
│   │   ├── schemas/          Qué datos recibe la API (login, producto, encuesta…)
│   │   ├── services/auth.py  Lógica de login y tokens JWT
│   │   └── routers/          Las rutas /api/...: auth, productos, encuestas, solicitudes, health
│   ├── data/                 Base SQLite local (se crea sola)
│   ├── sql/                  Script de la base MySQL (esquema_despensa.sql)
│   ├── requirements.txt
│   ├── .env.example          Plantilla de configuración
│   └── Dockerfile
├── frontend/                 Interfaz en React (sin compilar, corre directo en el navegador)
│   ├── index.html            Carga los archivos en orden
│   ├── src/
│   │   ├── config.jsx        URL de la API
│   │   ├── data/             Productos de ejemplo y preguntas de la encuesta
│   │   ├── components/       Piezas reutilizables: Navbar, ProductCard, FilterPanel, Footer
│   │   ├── views/            Pantallas: Home, Products, Detail, Encuesta, Admin…
│   │   ├── App.jsx           Componente principal (estado y navegación)
│   │   └── main.jsx          Arranque de React
│   ├── styles/styles.css
│   ├── assets/images/
│   ├── nginx.conf            Servidor web + reenvío de /api al backend
│   └── Dockerfile
└── docker-compose.yml        Levanta backend + frontend juntos
```

## Cómo ejecutarlo

### Con Docker (recomendado)
```bash
cp backend/.env.example backend/.env    # opcional: ajusta credenciales
docker compose up --build
```
Abrir: <http://localhost:8090> (documentación de la API: <http://localhost:8090/docs>)

### Sin Docker (desarrollo)
Terminal 1 – backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 9099
```
Terminal 2 – frontend:
```bash
cd frontend
python -m http.server 8090
```
Abrir: <http://localhost:8090> (el frontend detecta solo que debe llamar al backend en el puerto 9099).

## Dónde cambiar cada cosa
| Quiero… | Archivo |
|---|---|
| Agregar/cambiar una ruta de la API | `backend/app/routers/` |
| Cambiar los datos que acepta un formulario | `backend/app/schemas/` |
| Cambiar usuario/clave de la base o el puerto | `backend/.env` |
| Cambiar una pantalla | `frontend/src/views/` |
| Cambiar el menú o el pie de página | `frontend/src/components/` |
| Cambiar colores y estilos | `frontend/styles/styles.css` |

> Si agregas un archivo `.jsx` nuevo, hay que añadirlo en `frontend/index.html` (antes de `App.jsx`).
