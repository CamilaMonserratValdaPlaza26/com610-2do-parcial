// Carga las variables de entorno del archivo .env (solo existe en la EC2)
require('dotenv').config();

const app = require('./src/app');
const PORT = 3005; // ERROR intencional: el contenedor escucha en otro puerto

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`API de libros escuchando en el puerto ${PORT}`);
});
