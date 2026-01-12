import express from 'express';
import pool from './db.js';

const app = express();
app.use(express.json());

// Crear usuario
app.post('/usuarios', async (req, res) => {
  const { nombre, correo, rol } = req.body;
  const result = await pool.query(
    'INSERT INTO usuarios (nombre, correo, rol) VALUES ($1, $2, $3) RETURNING *',
    [nombre, correo, rol]
  );
  res.json(result.rows[0]);
});

// Listar usuarios
app.get('/usuarios', async (req, res) => {
  const result = await pool.query('SELECT * FROM usuarios');
  res.json(result.rows);
});

// Crear solicitud
app.post('/solicitudes', async (req, res) => {
  const { titulo, descripcion, solicitante_id, responsable_id, tipo } = req.body;
  const result = await pool.query(
    `INSERT INTO solicitudes (titulo, descripcion, solicitante_id, responsable_id, tipo)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [titulo, descripcion, solicitante_id, responsable_id, tipo]
  );
  res.json(result.rows[0]);
});

// Listar solicitudes
app.get('/solicitudes', async (req, res) => {
  const result = await pool.query('SELECT * FROM solicitudes');
  res.json(result.rows);
});

app.listen(8080, () => {
  console.log('Servidor backend corriendo en http://localhost:8080');
});
