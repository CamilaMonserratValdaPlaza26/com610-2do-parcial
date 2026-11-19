// API REST de libros con Express
const express = require('express');
const repo = require('./librosRepo');

// Version visible en /health (se cambia para demostrar un nuevo despliegue)
const VERSION = '1.0.0';

const app = express();
app.use(express.json());

// Valida el id de la ruta: entero positivo
function leerId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Valida el cuerpo de un libro; devuelve la lista de errores
function validarLibro(body) {
  const errores = [];
  const { titulo, autor, anio_publicacion } = body || {};
  const anioActual = new Date().getFullYear();

  if (typeof titulo !== 'string' || titulo.trim() === '') {
    errores.push('titulo es obligatorio y no puede estar vacio');
  }
  if (typeof autor !== 'string' || autor.trim() === '') {
    errores.push('autor es obligatorio y no puede estar vacio');
  }
  if (!Number.isInteger(anio_publicacion) || anio_publicacion < 1 || anio_publicacion > anioActual) {
    errores.push(`anio_publicacion debe ser un entero entre 1 y ${anioActual}`);
  }
  return errores;
}

// Datos limpios que se guardan en la base
function datosLibro(body) {
  return {
    titulo: body.titulo.trim(),
    autor: body.autor.trim(),
    anio_publicacion: body.anio_publicacion
  };
}

// Pagina de inicio con la lista de endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    servicio: 'API de libros - COM610 2do parcial',
    endpoints: ['GET /health', 'GET /libros', 'GET /libros/:id', 'POST /libros', 'PUT /libros/:id', 'DELETE /libros/:id']
  });
});

// Estado del servicio
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', servicio: 'api-libros', version: VERSION });
});

// Lista todos los libros
app.get('/libros', async (req, res) => {
  const libros = await repo.listar();
  res.status(200).json(libros);
});

// Obtiene un libro por id
app.get('/libros/:id', async (req, res) => {
  const id = leerId(req);
  if (!id) return res.status(400).json({ error: 'El id debe ser un entero positivo' });

  const libro = await repo.obtener(id);
  if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
  res.status(200).json(libro);
});

// Crea un libro
app.post('/libros', async (req, res) => {
  const errores = validarLibro(req.body);
  if (errores.length > 0) return res.status(400).json({ errores });

  const libro = await repo.crear(datosLibro(req.body));
  res.status(201).json(libro);
});

// Actualiza un libro
app.put('/libros/:id', async (req, res) => {
  const id = leerId(req);
  if (!id) return res.status(400).json({ error: 'El id debe ser un entero positivo' });

  const errores = validarLibro(req.body);
  if (errores.length > 0) return res.status(400).json({ errores });

  const libro = await repo.actualizar(id, datosLibro(req.body));
  if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
  res.status(200).json(libro);
});

// Elimina un libro
app.delete('/libros/:id', async (req, res) => {
  const id = leerId(req);
  if (!id) return res.status(400).json({ error: 'El id debe ser un entero positivo' });

  const eliminado = await repo.eliminar(id);
  if (!eliminado) return res.status(404).json({ error: 'Libro no encontrado' });
  res.status(200).json({ mensaje: 'Libro eliminado', id });
});

// Ruta inexistente
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores: JSON mal formado (400) o error interno (500)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON mal formado' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
