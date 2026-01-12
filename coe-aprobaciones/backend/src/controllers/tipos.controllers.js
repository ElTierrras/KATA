import pool from '../db.js';

export let listarTipos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tipos');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar tipos', error: error.message });
  }
};

export let crearTipo = async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tipos (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [nombre, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear tipo', error: error.message });
  }
};

export let eliminarTipo = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tipos WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tipo no encontrado' });
    }
    res.json({ message: 'Tipo eliminado correctamente', tipo: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tipo', error: error.message });
  }
};