import { Router } from "express";
import { 
  enviarCorreo, 
  bandejaUsuario 
} from "../controllers/notificaciones.controllers.js";

let routerNotificaciones = Router();

routerNotificaciones.post('/notificaciones/enviar', enviarCorreo);
routerNotificaciones.get('/notificaciones/:usuario_id', bandejaUsuario);

export default routerNotificaciones;