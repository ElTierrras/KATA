import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import routerUsuarios from './routes/usuarios.routes.js';
import routerSolicitudes from './routes/solicitudes.routes.js';
import routerHistorial from './routes/historial.routes.js';
import routerTipos from './routes/tipo.routes.js';
import routerNotificaciones from './routes/notificaciones.routes.js';

const app = express();

app.use(express.json());

app.use(routerUsuarios);
app.use(routerSolicitudes);
app.use(routerHistorial);
app.use(routerTipos);
app.use(routerNotificaciones);


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`📡 Base de datos: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
  console.log(`🔒 Ambiente: ${process.env.NODE_ENV}`);
});