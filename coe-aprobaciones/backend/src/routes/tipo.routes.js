import { Router } from "express";
import { 
  listarTipos, 
  crearTipo, 
  eliminarTipo 
} from "../controllers/tipos.controllers.js";

let routerTipos = Router();

routerTipos.get('/tipos', listarTipos);
routerTipos.post('/tipos', crearTipo);
routerTipos.delete('/tipos/:id', eliminarTipo);

export default routerTipos;