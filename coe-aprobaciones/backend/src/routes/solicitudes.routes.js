import { Router } from "express";
import { 
  listarSolicitudes, 
  obtenerSolicitud, 
  crearSolicitud, 
  actualizarSolicitud, 
  eliminarSolicitud,
  aprobarSolicitud,
  rechazarSolicitud,
  obtenerHistorial
} from "../controllers/solicitudes.controllers.js";

let routerSolicitudes = Router();

routerSolicitudes.get('/solicitudes', listarSolicitudes);
routerSolicitudes.post('/solicitudes', crearSolicitud);
routerSolicitudes.get('/solicitudes/:id', obtenerSolicitud);
routerSolicitudes.put('/solicitudes/:id', actualizarSolicitud);
routerSolicitudes.delete('/solicitudes/:id', eliminarSolicitud);
routerSolicitudes.put('/solicitudes/:id/aprobar', aprobarSolicitud);
routerSolicitudes.put('/solicitudes/:id/rechazar', rechazarSolicitud);
routerSolicitudes.get('/solicitudes/:id/historial', obtenerHistorial);

export default routerSolicitudes;