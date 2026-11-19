-- Base de datos del examen (en RDS ya existe; IF NOT EXISTS evita errores)
CREATE DATABASE IF NOT EXISTS db_libros
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE db_libros;

-- Tabla de libros
CREATE TABLE IF NOT EXISTS libros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  autor VARCHAR(150) NOT NULL,
  anio_publicacion INT NOT NULL
);