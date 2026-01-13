import { Router } from "express";
import { 
  crearSolicitud, 
  listarSolicitudes, 
  detalleSolicitud, 
  aprobarSolicitud, 
  rechazarSolicitud, 
  comentarSolicitud, 
  eliminarSolicitud 
} from "../controllers/solicitudes.controllers.js";

let routerSolicitudes = Router();

routerSolicitudes.post('/crear-solicitud', crearSolicitud);
routerSolicitudes.get('/solicitudes', listarSolicitudes);
routerSolicitudes.get('/solicitudes/:id', detalleSolicitud);
routerSolicitudes.put('/solicitudes/:id/aprobar', aprobarSolicitud);
routerSolicitudes.put('/solicitudes/:id/rechazar', rechazarSolicitud);
routerSolicitudes.put('/solicitudes/:id/comentar', comentarSolicitud);
routerSolicitudes.delete('/solicitudes/:id', eliminarSolicitud);

export default routerSolicitudes;