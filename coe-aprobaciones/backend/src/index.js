import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Carga dotenv explícitamente desde la raíz
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import routerUsuarios from './routes/usuarios.routes.js';
import routerSolicitudes from './routes/solicitudes.routes.js';
import routerHistorial from './routes/historial.routes.js';
import routerTipos from './routes/tipo.routes.js';
import routerNotificaciones from './routes/notificaciones.routes.js';
import pool from './db.js';

const app = express();

app.use(express.json());

// Debug: Verifica que las variables se cargan
console.log('📋 Variables de entorno cargadas:');
console.log('PORT:', process.env.PORT);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('🔧 Ruta de .env:', path.resolve(__dirname, '../.env'));

// Rutas
app.use(routerUsuarios);
app.use(routerSolicitudes);
app.use(routerHistorial);
app.use(routerTipos);
app.use(routerNotificaciones);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Servidor funcionando correctamente',
    port: process.env.PORT,
    env: process.env.NODE_ENV,
    db: `${process.env.DB_HOST}:${process.env.DB_PORT}`
  });
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`📡 Base de datos: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
  console.log(`🔒 Ambiente: ${process.env.NODE_ENV}`);
});

// Manejo de errores
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Puerto ${PORT} ya está en uso`);
    process.exit(1);
  }
});

// Cierre gracioso
process.on('SIGTERM', () => {
  console.log('📛 SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    pool.end();
    console.log('✅ Servidor cerrado');
    process.exit(0);
  });
});