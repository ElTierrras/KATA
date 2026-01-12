import { Router } from "express";
import { 
  historialPorSolicitud, 
  historialGlobal 
} from "../controllers/historial.controllers.js";

let routerHistorial = Router();

routerHistorial.get('/historial', historialGlobal);
routerHistorial.get('/historial/solicitudes/:id', historialPorSolicitud);

export default routerHistorial;