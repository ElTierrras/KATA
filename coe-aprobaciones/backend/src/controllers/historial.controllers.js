import pool from '../db.js';

export let historialPorSolicitud = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM historial WHERE solicitud_id = $1 ORDER BY fecha_creacion DESC',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No hay historial para esta solicitud' });
    }
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial de solicitud', error: error.message });
  }
};

export let historialGlobal = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM historial ORDER BY fecha_creacion DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial global', error: error.message });
  }
};