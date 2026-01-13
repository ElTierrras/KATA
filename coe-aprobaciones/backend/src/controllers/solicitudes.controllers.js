import pool from '../db.js';

export let listarSolicitudes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM solicitudes ORDER BY fecha_creacion DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error listando solicitudes:', error.message);
    res.status(500).json({ message: 'Error al listar solicitudes', error: error.message });
  }
};

export let obtenerSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM solicitudes WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo solicitud:', error.message);
    res.status(500).json({ message: 'Error al obtener solicitud', error: error.message });
  }
};

export let crearSolicitud = async (req, res) => {
  try {
    const { titulo, descripcion, tipo_solicitud, monto, solicitante_id } = req.body;

    if (!titulo || !tipo_solicitud || !monto || !solicitante_id) {
      return res.status(400).json({ 
        message: 'Campos requeridos: titulo, tipo_solicitud, monto, solicitante_id' 
      });
    }

    const result = await pool.query(
      'INSERT INTO solicitudes (titulo, descripcion, tipo_solicitud, monto, solicitante_id, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [titulo, descripcion, tipo_solicitud, monto, solicitante_id, 'pendiente']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando solicitud:', error.message);
    res.status(500).json({ message: 'Error al crear solicitud', error: error.message });
  }
};

export let actualizarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, tipo_solicitud, monto } = req.body;

    const result = await pool.query(
      'UPDATE solicitudes SET titulo = $1, descripcion = $2, tipo_solicitud = $3, monto = $4 WHERE id = $5 RETURNING *',
      [titulo, descripcion, tipo_solicitud, monto, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando solicitud:', error.message);
    res.status(500).json({ message: 'Error al actualizar solicitud', error: error.message });
  }
};

export let eliminarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM solicitudes WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    
    res.json({ message: 'Solicitud eliminada', solicitud: result.rows[0] });
  } catch (error) {
    console.error('Error eliminando solicitud:', error.message);
    res.status(500).json({ message: 'Error al eliminar solicitud', error: error.message });
  }
};

export let aprobarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { comentario } = req.body;

    if (!comentario) {
      return res.status(400).json({ message: 'El comentario es requerido' });
    }

    // Actualizar solicitud a aprobada
    const solicitudResult = await pool.query(
      'UPDATE solicitudes SET estado = $1 WHERE id = $2 RETURNING *',
      ['aprobada', id]
    );
    
    if (solicitudResult.rows.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    // Guardar en historial
    await pool.query(
      'INSERT INTO historial (solicitud_id, estado, usuario_id, comentario) VALUES ($1, $2, $3, $4)',
      [id, 'aprobada', 'usuario-actual', comentario]
    );

    res.json(solicitudResult.rows[0]);
  } catch (error) {
    console.error('Error aprobando solicitud:', error.message);
    res.status(500).json({ message: 'Error al aprobar solicitud', error: error.message });
  }
};

export let rechazarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo_rechazo } = req.body;

    if (!motivo_rechazo) {
      return res.status(400).json({ message: 'El motivo del rechazo es requerido' });
    }

    // Actualizar solicitud a rechazada
    const solicitudResult = await pool.query(
      'UPDATE solicitudes SET estado = $1 WHERE id = $2 RETURNING *',
      ['rechazada', id]
    );
    
    if (solicitudResult.rows.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    // Guardar en historial
    await pool.query(
      'INSERT INTO historial (solicitud_id, estado, usuario_id, comentario) VALUES ($1, $2, $3, $4)',
      [id, 'rechazada', 'usuario-actual', motivo_rechazo]
    );

    res.json(solicitudResult.rows[0]);
  } catch (error) {
    console.error('Error rechazando solicitud:', error.message);
    res.status(500).json({ message: 'Error al rechazar solicitud', error: error.message });
  }
};

export let obtenerHistorial = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM historial WHERE solicitud_id = $1 ORDER BY fecha DESC',
      [id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo historial:', error.message);
    res.status(500).json({ message: 'Error al obtener historial', error: error.message });
  }
};