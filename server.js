// Carga las variables de entorno del archivo .env (solo existe en la EC2)
require('dotenv').config();

const app = require('./src/app');
const PORT = process.env.PORT || 3000;

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`API de libros escuchando en el puerto ${PORT}`);
});
