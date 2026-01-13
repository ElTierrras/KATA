import { Router } from "express";
import { 
  listarTipos, 
  obtenerTipo, 
  crearTipo, 
  actualizarTipo, 
  eliminarTipo 
} from "../controllers/tipos.controllers.js";

let routerTipos = Router();

routerTipos.get('/tipos', listarTipos);
routerTipos.post('/tipos', crearTipo);
routerTipos.get('/tipos/:id', obtenerTipo);
routerTipos.put('/tipos/:id', actualizarTipo);
routerTipos.delete('/tipos/:id', eliminarTipo);

export default routerTipos;