// Capa de datos: todas las consultas SQL sobre la tabla libros.
// Se usan consultas parametrizadas (?) para evitar inyeccion SQL.
const pool = require('./db');

// Devuelve todos los libros
async function listar() {
  const [filas] = await pool.query(
    'SELECT id, titulo, autor, anio_publicacion FROM libros ORDER BY id'
  );
  return filas;
}

// Busca un libro por id; devuelve null si no existe
async function obtener(id) {
  const [filas] = await pool.execute(
    'SELECT id, titulo, autor, anio_publicacion FROM libros WHERE id = ?',
    [id]
  );
  return filas[0] || null;
}

// Inserta un libro y devuelve el registro creado
async function crear({ titulo, autor, anio_publicacion }) {
  const [resultado] = await pool.execute(
    'INSERT INTO libros (titulo, autor, anio_publicacion) VALUES (?, ?, ?)',
    [titulo, autor, anio_publicacion]
  );
  return obtener(resultado.insertId);
}

// Actualiza un libro; devuelve null si no existe
async function actualizar(id, { titulo, autor, anio_publicacion }) {
  const [resultado] = await pool.execute(
    'UPDATE libros SET titulo = ?, autor = ?, anio_publicacion = ? WHERE id = ?',
    [titulo, autor, anio_publicacion, id]
  );
  if (resultado.affectedRows === 0) return null;
  return obtener(id);
}

// Elimina un libro; devuelve true si existia
async function eliminar(id) {
  const [resultado] = await pool.execute('DELETE FROM libros WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
