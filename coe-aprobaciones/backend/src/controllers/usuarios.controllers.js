import pool from '../db.js';

export let listarUsuarios = async (req, res)=> {
  const result =  await pool.query('SELECT * FROM usuarios');
  res.json(result.rows);
}

export let crearUsuario = async (req, res) => {
  const { nombre, correo, rol } = req.body;
  const result = await pool.query(
    'INSERT INTO usuarios (nombre, correo, rol) VALUES ($1, $2, $3) RETURNING *',
    [nombre, correo, rol]
  );
  res.json(result.rows[0]);
};

export let detalleUsuario = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  res.json(result.rows[0]);
};

export let actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, rol } = req.body;
  const result = await pool.query(
    'UPDATE usuarios SET nombre = $1, correo = $2, rol = $3 WHERE id = $4 RETURNING *',
    [nombre, correo, rol, id]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  res.json(result.rows[0]);
};

export let eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  res.json({ message: 'Usuario eliminado correctamente', usuario: result.rows[0] });
};

