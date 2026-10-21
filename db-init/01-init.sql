CREATE DATABASE IF NOT EXISTS tienda_rag
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE tienda_rag;

CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    descripcion VARCHAR(255)
);

INSERT INTO productos (nombre, precio, descripcion) VALUES
('Gorra negra bordada', 350.00, 'Gorra snapback color negro con logo bordado'),
('Playera oversize blanca', 420.00, 'Playera de algodón corte oversize'),
('Sudadera gris con capucha', 780.00, 'Hoodie unisex talla única'),
('Cadena bañada en oro', 650.00, 'Cadena cubana bañada en oro de 18k, 50cm'),
('Anillo bañado en oro', 280.00, 'Anillo ajustable bañado en oro');
