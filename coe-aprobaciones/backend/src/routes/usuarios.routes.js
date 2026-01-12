import { Router } from "express";
import { crearUsuario, listarUsuarios, detalleUsuario, actualizarUsuario, eliminarUsuario } from "../controllers/usuarios.controllers.js";

let routerUsuarios = Router();

routerUsuarios.get('/usuarios', listarUsuarios);
routerUsuarios.post('/usuarios', crearUsuario);
routerUsuarios.get('/usuarios/:id', detalleUsuario);
routerUsuarios.put('/usuarios/:id', actualizarUsuario);
routerUsuarios.delete('/usuarios/:id', eliminarUsuario);

export default routerUsuarios;