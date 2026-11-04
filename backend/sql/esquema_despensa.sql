-- ==============================================================================
-- BASE DE DATOS: despensa
-- Proyecto: Despensa Digital Comunitaria - Travesías (Grupo 9)
-- 4 Tablas para Gestión de Productos y Solicitudes
-- ==============================================================================

USE `despensa`;

-- Desactivar temporalmente revisión de claves foráneas para creación limpia
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `solicitud_producto`;
DROP TABLE IF EXISTS `producto`;
DROP TABLE IF EXISTS `tipo_producto`;
DROP TABLE IF EXISTS `productor`;
DROP TABLE IF EXISTS `solicitante`;

SET FOREIGN_KEY_CHECKS = 1;


-- ==============================================================================
-- 1. TABLA: productor (Quién crea / publica el producto)
-- ==============================================================================
CREATE TABLE `productor` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre_completo` VARCHAR(120) NOT NULL,
    `rol_comunidad` VARCHAR(60) NOT NULL DEFAULT 'Productor Local', -- 'Estudiante', 'Docente', 'Productor Local', 'Egresado'
    `telefono_contacto` VARCHAR(25) NOT NULL,
    `correo` VARCHAR(100) NULL,
    `ubicacion` VARCHAR(150) DEFAULT 'Florencia, Caquetá',
    `activo` BOOLEAN DEFAULT TRUE,
    `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================================================
-- 2. TABLA: tipo_producto (Clasificación / Categoría del producto)
-- ==============================================================================
CREATE TABLE `tipo_producto` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(60) NOT NULL UNIQUE, -- 'Alimentos', 'Agricultura', 'Artesanías'
    `descripcion` VARCHAR(255) NULL,
    `activo` BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================================================
-- 3. TABLA: producto (Información, descripción, precio y estado del producto)
-- ==============================================================================
CREATE TABLE `producto` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(150) NOT NULL,
    `descripcion` TEXT NULL,
    `precio` DECIMAL(12, 2) NOT NULL,
    `unidad_medida` VARCHAR(30) DEFAULT 'kg', -- 'kg', 'Unidad', '500g', 'Mano', 'Panal'
    `presentacion` VARCHAR(100) NULL,
    `url_imagen` TEXT NULL,
    `disponible` BOOLEAN DEFAULT TRUE,
    `id_tipo_producto` INT NOT NULL,
    `id_productor` INT NOT NULL,
    `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_producto_tipo`
        FOREIGN KEY (`id_tipo_producto`) REFERENCES `tipo_producto` (`id`)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_producto_productor`
        FOREIGN KEY (`id_productor`) REFERENCES `productor` (`id`)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================================================
-- 4. TABLA: solicitante (Quién solicita o contacta por el producto)
-- ==============================================================================
CREATE TABLE `solicitante` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre_completo` VARCHAR(120) NOT NULL,
    `telefono` VARCHAR(25) NOT NULL,
    `correo` VARCHAR(100) NULL,
    `tipo_solicitante` VARCHAR(50) DEFAULT 'Comunidad Universitaria',
    `dependencia_o_rol` VARCHAR(100) NULL,
    `activo` BOOLEAN DEFAULT TRUE,
    `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================================================
-- 5. TABLA: encuesta_usabilidad_respuestas (Evaluación institucional de 5 preguntas)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `encuesta_usabilidad_respuestas` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `subproyecto_id` VARCHAR(64) NOT NULL,
    `usuario_id` VARCHAR(128) NOT NULL,
    `version_encuesta` SMALLINT UNSIGNED NOT NULL DEFAULT 2,
    `respuesta_1` TINYINT UNSIGNED NOT NULL,
    `respuesta_2` TINYINT UNSIGNED NOT NULL,
    `respuesta_3` TINYINT UNSIGNED NOT NULL,
    `respuesta_4` TINYINT UNSIGNED NOT NULL,
    `respuesta_5` TINYINT UNSIGNED NOT NULL,
    `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_encuesta_usuario_subproyecto_version`
        (`usuario_id`, `subproyecto_id`, `version_encuesta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; -- 'Estudiante', 'Docente', 'Externo'
    `id_producto` INT NOT NULL,
    `cantidad_solicitada` INT DEFAULT 1,
    `mensaje` TEXT NULL,
    `estado` VARCHAR(30) DEFAULT 'Pendiente', -- 'Pendiente', 'Contactado', 'Concretado'
    `fecha_solicitud` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_solicitud_producto`
        FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================================================
-- DATOS INICIALES (Para probar de una vez en el catálogo)
-- ==============================================================================

-- 1. Productores iniciales
INSERT INTO `productor` (`nombre_completo`, `rol_comunidad`, `telefono_contacto`, `correo`, `ubicacion`) VALUES
('Asociación Agroecológica Uniamazonia', 'Estudiante', '3100000001', 'agroecologia@uniamazonia.edu.co', 'Campus Macagual, Caquetá'),
('Comunidad Artesanal Coreguaje', 'Comunidad Local', '3100000002', 'artesanias@uniamazonia.edu.co', 'Milán, Caquetá'),
('Granja Experimental Santo Domingo', 'Docente', '3100000003', 'granja@uniamazonia.edu.co', 'Florencia, Caquetá');

-- 2. Tipos de productos
INSERT INTO `tipo_producto` (`nombre`, `descripcion`) VALUES
('Alimentos', 'Frutas, verduras, lácteos y productos frescos de huerta'),
('Agricultura', 'Miel, abonos, semillas y productos de la granja experimental'),
('Artesanías', 'Tejidos en fibra natural, bolsos y artesanías indígenas');

-- 3. Productos del catálogo
INSERT INTO `producto` (`nombre`, `descripcion`, `precio`, `unidad_medida`, `presentacion`, `url_imagen`, `disponible`, `id_tipo_producto`, `id_productor`) VALUES
('Aguacates Orgánicos del Caquetá', 'Aguacates frescos cultivados sin agroquímicos por familias productoras de la región amazónica.', 12000.00, 'kg', 'Malla por 1 kg', 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80', TRUE, 1, 1),
('Bolso Tejido Coreguaje', 'Elaborado a mano con fibras naturales de cumare por artesanos indígenas de la comunidad Coreguaje.', 45000.00, 'Unidad', 'Tejido artesanal en fibra natural', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80', TRUE, 3, 2),
('Café Amazónico Especial', 'Café de origen cultivado bajo sombra en sistemas agroforestales sostenibles del piedemonte.', 18000.00, '500g', 'Bolsa con válvula 500g', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80', TRUE, 1, 1),
('Miel de Abejas Silvestre', 'Miel 100% natural recolectada artesanalmente por estudiantes de Ingeniería Agroecológica.', 25000.00, '500ml', 'Frasco de Vidrio 500ml', 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80', TRUE, 2, 3),
('Bananos de Seda Frescos', 'Bananos dulces cosechados en parcelas comunitarias de productores locales.', 5000.00, 'Mano', 'Mano fresca (~1.5 kg)', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80', TRUE, 1, 1),
('Piña Golden Amazónica', 'Piña jugosa y dulce cultivada en suelos amazónicos con manejo agroecológico.', 7000.00, 'Unidad', 'Unidad seleccionada', 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80', TRUE, 1, 1);

-- 4. Solicitante de ejemplo
INSERT INTO `solicitante` (`nombre_completo`, `telefono`, `correo`, `tipo_solicitante`, `id_producto`, `cantidad_solicitada`, `mensaje`) VALUES
('Carlos Mendoza', '3151234567', 'carlos.mendoza@uniamazonia.edu.co', 'Docente', 1, 2, 'Buenas tardes, me interesa adquirir 2 kg de aguacate orgánico.');

