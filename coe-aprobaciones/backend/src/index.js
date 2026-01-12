import express from 'express';
import routerUsuarios from './routes/usuarios.routes.js';
import routersolicitudes from './routes/solicitudes.routes.js';
import routerHistorial from './routes/historial.routes.js';
import routerTipos from './routes/tipo.routes.js';

const app = express();
app.use(express.json());

app.use(routerUsuarios);
app.use(routersolicitudes);
app.use(routerHistorial);
app.use(routerTipos);


app.listen(8080, () => {
  console.log('Servidor backend corriendo en http://localhost:8080');
});
