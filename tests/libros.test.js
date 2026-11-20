// Pruebas de la API sin RDS real:
// la capa de datos (librosRepo) se reemplaza por un doble de prueba con jest.mock
jest.mock('../src/librosRepo');

const request = require('supertest');
const app = require('../src/app');
const repo = require('../src/librosRepo');

const libroValido = { titulo: 'Cien anos de soledad', autor: 'Gabriel Garcia Marquez', anio_publicacion: 1967 };

beforeEach(() => {
  jest.resetAllMocks();
});

describe('API de libros', () => {
  test('GET /health responde 200 y status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(500);
    // Cambio de estas dos líneas para pull request SOY MONSEEEE VALDA
    expect(res.body.status).toBe('ok');
  });

  test('GET /libros devuelve la lista de la capa de datos', async () => {
    repo.listar.mockResolvedValue([{ id: 1, ...libroValido }]);
    const res = await request(app).get('/libros');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test('POST /libros crea un libro valido y responde 201', async () => {
    repo.crear.mockResolvedValue({ id: 1, ...libroValido });
    const res = await request(app).post('/libros').send(libroValido);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ id: 1, ...libroValido });
    expect(repo.crear).toHaveBeenCalledWith(libroValido);
  });

  test('POST /libros rechaza titulo vacio con 400', async () => {
    const res = await request(app).post('/libros').send({ ...libroValido, titulo: '   ' });
    expect(res.statusCode).toBe(400);
    expect(repo.crear).not.toHaveBeenCalled();
  });

  test('POST /libros rechaza anio_publicacion no entero con 400', async () => {
    const res = await request(app).post('/libros').send({ ...libroValido, anio_publicacion: 'mil' });
    expect(res.statusCode).toBe(400);
    expect(repo.crear).not.toHaveBeenCalled();
  });

  test('GET /libros/:id responde 404 si el libro no existe', async () => {
    repo.obtener.mockResolvedValue(null);
    const res = await request(app).get('/libros/999');
    expect(res.statusCode).toBe(404);
  });

  test('PUT /libros/:id responde 404 si el libro no existe', async () => {
    repo.actualizar.mockResolvedValue(null);
    const res = await request(app).put('/libros/999').send(libroValido);
    expect(res.statusCode).toBe(404);
  });

  test('DELETE /libros/:id responde 404 si el libro no existe', async () => {
    repo.eliminar.mockResolvedValue(false);
    const res = await request(app).delete('/libros/999');
    expect(res.statusCode).toBe(404);
  });
});
