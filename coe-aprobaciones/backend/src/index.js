import 'dotenv/config';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

import routerUsuarios from './routes/usuarios.routes.js';
import routerSolicitudes from './routes/solicitudes.routes.js';
import routerHistorial from './routes/historial.routes.js';
import routerTipos from './routes/tipo.routes.js';
import routerNotificaciones from './routes/notificaciones.routes.js';
import pool from './db.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routerUsuarios);
app.use(routerSolicitudes);
app.use(routerHistorial);
app.use(routerTipos);
app.use(routerNotificaciones);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 8080;

console.log(`📍 Puerto configurado: ${PORT}`);
console.log(`📍 Variables de entorno cargadas: NODE_ENV=${process.env.NODE_ENV}`);
console.log(`⚠️  CORS: Sin restricciones (permiso a todos los orígenes)`);

const server = app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});

server.on('error', (error) => {
  console.error('❌ Error al iniciar el servidor:', error);
});