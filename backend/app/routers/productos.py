import sqlite3

from fastapi import APIRouter, status

from app.db.mysql import obtener_conexion_mysql
from app.db.sqlite import conectar_sqlite
from app.schemas.producto import ProductoIn

router = APIRouter(prefix="/api/productos", tags=["productos"])

_semilla_verificada = False


def verificar_semilla_inicial_mysql(conn):
    global _semilla_verificada
    if _semilla_verificada:
        return
    _semilla_verificada = True
    try:
        cur = conn.cursor()
        # Corregir URL rota de Miel de Abejas Silvestre si existe
        cur.execute(
            """
            UPDATE producto
            SET url_imagen = 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80'
            WHERE url_imagen LIKE '%photo-1587049352847-4a222e784d38%'
            """
        )
        cur.execute("SELECT COUNT(*), COALESCE(MAX(id), 0) FROM producto")
        total, max_id = cur.fetchone()
        if total == 4 and max_id == 4:
            # Completar catálogo inicial para mostrar bloques de 6 productos por página
            nuevos = [
                ('Bananos de Seda Frescos', 'Bananos de seda dulces cosechados en parcelas comunitarias de productores locales.', 5000.00, 'Mano', 'Mano fresca (~1.5 kg)', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80', 1, 1, 1),
                ('Piña Golden Amazónica', 'Piña jugosa y dulce cultivada en suelos amazónicos con manejo agroecológico.', 7000.00, 'Un', 'Unidad seleccionada', 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80', 1, 1, 1),
                ('Pulpa de Açaí Congelada', 'Pulpa pura de açaí amazónico cosechado de manera sostenible en el Caquetá.', 15000.00, '500g', 'Empaque 500g', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80', 1, 1, 1),
                ('Tomates Chonto Orgánicos', 'Tomates frescos de huerta comunitaria universitaria, libres de pesticidas.', 4500.00, 'kg', 'Bolsa por 1 kg', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80', 1, 1, 1),
                ('Limón Pajarito Uniamazonia', 'Limón pajarito de alto jugo producido en granjas experimentales y parcelas campesinas.', 3000.00, 'kg', 'Malla por 1 kg', 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=800&q=80', 1, 1, 1),
                ('Huevos Semicriollos', 'Huevos semicriollos de gallinas criadas en pastoreo libre en granjas locales.', 16000.00, 'Panal', 'Panal de 30 unidades', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80', 1, 1, 1),
                ('Queso Caqueteño Artesanal', 'Queso fresco con denominación de origen caqueteño elaborado por familias ganaderas sostenibles.', 14000.00, 'lb', 'Bloque de 500g empacado al vacío', 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80', 1, 1, 1),
                ('Panela Pulverizada Orgánica', 'Panela 100% natural libre de químicos, producida en trapiches comunitarios del piedemonte amazónico.', 6500.00, 'kg', 'Bolsa ecológica por 1 kg', 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=800&q=80', 1, 2, 1),
            ]
            cur.executemany(
                """
                INSERT INTO producto (
                    nombre, descripcion, precio, unidad_medida, presentacion, url_imagen, disponible, id_tipo_producto, id_productor
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                nuevos,
            )
        conn.commit()
        cur.close()
    except Exception as e:
        print(f"Aviso semilla inicial MySQL ({e})")


@router.get("")
def listar_productos():
    """
    Obtiene los productos desde MySQL ('despensa' - 4 tablas).
    Si MySQL no está disponible, utiliza SQLite local como respaldo resiliente.
    """
    # 1. Intentar consultar base de datos MySQL 'despensa'
    try:
        conn = obtener_conexion_mysql()
        verificar_semilla_inicial_mysql(conn)
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
                if item.get("imageUrl") and "photo-1587049352847-4a222e784d38" in item["imageUrl"]:
                    item["imageUrl"] = "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80"
            return filas
    except Exception as e:
        print(f"Aviso MySQL despensa ({e}). Utilizando base de datos local SQLite.")

    # 2. Respaldo local SQLite
    conn_local = conectar_sqlite()
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


@router.post("", status_code=status.HTTP_201_CREATED)
def crear_producto(p: ProductoIn):
    """
    Registra un nuevo producto vinculando productor y categoría (tipo_producto).
    """
    # Parsear precio numérico
    precio_numerico = 10000.0
    try:
        parte_precio = p.price.split("/")[0]
        solo_digitos = "".join([c for c in parte_precio if c.isdigit() or c in ",."])
        solo_digitos = solo_digitos.replace(".", "").replace(",", ".")
        if solo_digitos:
            precio_numerico = float(solo_digitos)
    except Exception:
        precio_numerico = 10000.0

    unidad_limpia = "kg"
    if "/" in p.price:
        unidad_limpia = p.price.split("/", 1)[1].strip() or "kg"
    elif p.unit:
        unidad_limpia = p.unit.replace("/", "").strip() or "kg"
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
    conn_local = conectar_sqlite()
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


@router.put("/{producto_id}")
def actualizar_producto(producto_id: int, p: ProductoIn):
    """
    Modifica la información, precio, categoría, estado o imagen de un producto existente.
    """
    precio_numerico = 10000.0
    try:
        # Extraer la parte numérica antes de '/'
        parte_precio = p.price.split("/")[0]
        solo_digitos = "".join([c for c in parte_precio if c.isdigit() or c in ",."])
        solo_digitos = solo_digitos.replace(".", "").replace(",", ".")
        if solo_digitos:
            precio_numerico = float(solo_digitos)
    except Exception:
        precio_numerico = 10000.0

    unidad_limpia = "kg"
    if "/" in p.price:
        unidad_limpia = p.price.split("/", 1)[1].strip() or "kg"
    elif p.unit:
        unidad_limpia = p.unit.replace("/", "").strip() or "kg"

    # 1. Actualizar en MySQL 'despensa'
    try:
        conn = obtener_conexion_mysql()
        cur = conn.cursor()

        cur.execute("SELECT id FROM tipo_producto WHERE LOWER(nombre) = LOWER(%s) LIMIT 1", (p.category,))
        row_tp = cur.fetchone()
        if row_tp:
            tipo_id = row_tp[0]
        else:
            cur.execute("INSERT INTO tipo_producto (nombre) VALUES (%s)", (p.category,))
            tipo_id = cur.lastrowid

        cur.execute(
            """
            UPDATE producto
            SET nombre = %s,
                descripcion = %s,
                precio = %s,
                unidad_medida = %s,
                presentacion = %s,
                url_imagen = %s,
                disponible = %s,
                id_tipo_producto = %s
            WHERE id = %s
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
                producto_id,
            ),
        )
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Aviso actualizar MySQL ({e})")

    # 2. Actualizar en SQLite local de respaldo
    conn_local = conectar_sqlite()
    try:
        cur = conn_local.cursor()
        cur.execute(
            """
            UPDATE productos_local
            SET name = ?,
                category = ?,
                price = ?,
                unit = ?,
                presentation = ?,
                imageUrl = ?,
                description = ?,
                available = ?
            WHERE id = ?
            """,
            (
                p.name,
                p.category,
                p.price,
                p.unit or f"/ {unidad_limpia}",
                p.presentation or "",
                p.imageUrl or "",
                p.description or "",
                1 if p.available else 0,
                producto_id,
            ),
        )
        conn_local.commit()
    finally:
        conn_local.close()

    return {
        "id": producto_id,
        "name": p.name,
        "category": p.category,
        "price": p.price,
        "unit": p.unit or f"/ {unidad_limpia}",
        "presentation": p.presentation,
        "imageUrl": p.imageUrl,
        "description": p.description,
        "available": p.available,
        "productor_nombre": p.productor_nombre,
    }


@router.delete("/{producto_id}")
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
    conn_local = conectar_sqlite()
    try:
        cur = conn_local.cursor()
        cur.execute("DELETE FROM productos_local WHERE id = ?", (producto_id,))
        conn_local.commit()
    finally:
        conn_local.close()

    return {"ok": True, "id": producto_id}

