import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración de __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

// Rutas
import routerUsuarios from './routes/usuarios.routes.js';
import routerSolicitudes from './routes/solicitudes.routes.js';
import routerHistorial from './routes/historial.routes.js';
import routerTipos from './routes/tipo.routes.js';
import routerNotificaciones from './routes/notificaciones.routes.js';

const app = express();

// Middlewares
app.use(express.json());

// Rutas
app.use(routerUsuarios);
app.use(routerSolicitudes);
app.use(routerHistorial);
app.use(routerTipos);
app.use(routerNotificaciones);

// Puerto
const PORT = process.env.PORT || 3000;

console.log(`📍 Puerto configurado: ${PORT}`);
console.log(`📍 Variables de entorno cargadas: NODE_ENV=${process.env.NODE_ENV}`);

// Servidor
const server = app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});

// Manejo de errores del servidor
server.on('error', (error) => {
  console.error('❌ Error al iniciar el servidor:', error);
});
