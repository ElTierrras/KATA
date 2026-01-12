import { Router } from "express";
import { listarUsuarios } from "../controllers/usuarios.controllers.js";

let routerUsuarios = Router();

routerUsuarios.get('/usuarios', listarUsuarios);


routerUsuarios.post('/usuarios', async (req, res) => {
  const { nombre, correo, rol } = req.body;
  const result = await pool.query(
    'INSERT INTO usuarios (nombre, correo, rol) VALUES ($1, $2, $3) RETURNING *',
    [nombre, correo, rol]
  );
  res.json(result.rows[0]);
});




export default routerUsuarios;