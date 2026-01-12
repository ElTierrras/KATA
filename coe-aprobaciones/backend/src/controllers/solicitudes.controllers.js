import pool from '../db.js';

export let crearSolicitud = async (req, res) => {
  const { titulo, descripcion, solicitante_id, responsable_id, tipo } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO solicitudes (titulo, descripcion, solicitante_id, responsable_id, tipo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [titulo, descripcion, solicitante_id, responsable_id, tipo]
    );
    // TODO: Implementar notificación aquí
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear solicitud', error: error.message });
  }
};

export let listarSolicitudes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM solicitudes');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar solicitudes', error: error.message });
  }
};

export let detalleSolicitud = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM solicitudes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener solicitud', error: error.message });
  }
};

export let aprobarSolicitud = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE solicitudes SET estado = $1, fecha_aprobacion = NOW() WHERE id = $2 RETURNING *',
      ['aprobada', id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    res.json({ message: 'Solicitud aprobada correctamente', solicitud: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error al aprobar solicitud', error: error.message });
  }
};

export let rechazarSolicitud = async (req, res) => {
  const { id } = req.params;
  const { motivo } = req.body;
  try {
    const result = await pool.query(
      'UPDATE solicitudes SET estado = $1, motivo_rechazo = $2, fecha_rechazo = NOW() WHERE id = $3 RETURNING *',
      ['rechazada', motivo, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    res.json({ message: 'Solicitud rechazada correctamente', solicitud: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error al rechazar solicitud', error: error.message });
  }
};

export let comentarSolicitud = async (req, res) => {
  const { id } = req.params;
  const { comentario, usuario_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO comentarios (solicitud_id, usuario_id, contenido, fecha_creacion) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [id, usuario_id, comentario]
    );
    res.status(201).json({ message: 'Comentario agregado correctamente', comentario: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error al comentar solicitud', error: error.message });
  }
};

export let eliminarSolicitud = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM solicitudes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    res.json({ message: 'Solicitud eliminada correctamente', solicitud: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar solicitud', error: error.message });
  }
};