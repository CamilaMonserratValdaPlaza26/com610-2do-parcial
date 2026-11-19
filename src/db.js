// Pool de conexiones a MySQL en Amazon RDS (mysql2 con promesas)
const mysql = require('mysql2/promise');

// Toda la configuracion llega por variables de entorno (.env en la EC2)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Conexion cifrada con el certificado de RDS que trae mysql2
  ssl: process.env.DB_SSL === 'false' ? undefined : 'Amazon RDS',
  waitForConnections: true,
  connectionLimit: 10
});

// createPool no se conecta hasta la primera consulta,
// por eso la app arranca aunque la base no este disponible
module.exports = pool;
