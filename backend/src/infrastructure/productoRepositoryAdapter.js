const ProductoRepositoryPort = require('../domain/productoRepositoryPort');
const pool = require('./db');

class ProductoRepositoryAdapter extends ProductoRepositoryPort {
    async buscarPorPalabras(palabras) {
        if (!palabras.length) return [];
        const condiciones = palabras.map(() => '(LOWER(nombre) LIKE ? OR LOWER(descripcion) LIKE ?)').join(' OR ');
        const valores = palabras.flatMap((p) => [`%${p}%`, `%${p}%`]);
        const [rows] = await pool.execute(
            `SELECT nombre, precio, descripcion FROM productos WHERE ${condiciones} LIMIT 5`,
            valores
        );
        return rows;
    }

    async findAll() {
        const [rows] = await pool.execute('SELECT nombre, precio FROM productos ORDER BY id ASC');
        return rows;
    }
}

module.exports = ProductoRepositoryAdapter;
