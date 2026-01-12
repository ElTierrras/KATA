import { Router } from "express";
import { crearUsuario, listarUsuarios, detalleUsuario, actualizarUsuario, eliminarUsuario, iniciarUsuario } from "../controllers/usuarios.controllers.js";

let routerUsuarios = Router();

routerUsuarios.get('/usuarios', listarUsuarios);
routerUsuarios.post('/login', iniciarUsuario);
routerUsuarios.post('/registro', crearUsuario);
routerUsuarios.get('/usuarios/:id', detalleUsuario);
routerUsuarios.put('/usuarios/:id', actualizarUsuario);
routerUsuarios.delete('/usuarios/:id', eliminarUsuario);

export default routerUsuarios;