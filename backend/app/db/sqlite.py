"""SQLite local: respaldo cuando MySQL no está disponible."""
import os
import sqlite3

from app.core.config import LOCAL_SQLITE_PATH


def conectar_sqlite():
    os.makedirs(os.path.dirname(LOCAL_SQLITE_PATH), exist_ok=True)
    return sqlite3.connect(LOCAL_SQLITE_PATH)


def inicializar_bd_local():
    """Inicializa tablas en SQLite local como respaldo de alta disponibilidad."""
    conn = conectar_sqlite()
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

