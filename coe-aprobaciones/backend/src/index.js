import express from 'express';
import dotenv from 'dotenv';


dotenv.config({ path: join(__dirname, '.env') });

import routerUsuarios from './routes/usuarios.routes.js';
import routerSolicitudes from './routes/solicitudes.routes.js';
import routerHistorial from './routes/historial.routes.js';
import routerTipos from './routes/tipo.routes.js';
import routerNotificaciones from './routes/notificaciones.routes.js';
import pool from './db.js';

const app = express();

// Middleware
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
