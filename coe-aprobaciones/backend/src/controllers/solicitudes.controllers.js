import pool from '../db.js';
import { 
  enviarNotificacionNuevaSolicitud, 
  enviarNotificacionAprobada, 
  enviarNotificacionRechazada 
} from '../services/emailService.js';

export let listarSolicitudes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id, s.titulo, s.descripcion, s.estado, s.fecha_creacion,
        s.solicitante_id, s.responsable_id, s.tipo,
        u1.nombre as solicitante_nombre, u1.correo as solicitante_correo, u1.rol as solicitante_rol,
        u2.nombre as responsable_nombre, u2.correo as responsable_correo, u2.rol as responsable_rol,
        t.nombre as tipo_nombre
      FROM solicitudes s
      LEFT JOIN usuarios u1 ON s.solicitante_id = u1.id
      LEFT JOIN usuarios u2 ON s.responsable_id = u2.id
      LEFT JOIN tipos t ON s.tipo = t.id
      ORDER BY s.fecha_creacion DESC
    `);
    
    const solicitudes = result.rows.map(row => ({
      id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      estado: row.estado,
      fecha_creacion: row.fecha_creacion,
      solicitante_id: row.solicitante_id,
      responsable_id: row.responsable_id,
      tipo: row.tipo,
      tipo_nombre: row.tipo_nombre,
      solicitante: {
        id: row.solicitante_id,
        nombre: row.solicitante_nombre,
        correo: row.solicitante_correo,
        rol: row.solicitante_rol
      },
      responsable: {
        id: row.responsable_id,
        nombre: row.responsable_nombre,
        correo: row.responsable_correo,
        rol: row.responsable_rol
      }
    }));
    
    res.json(solicitudes);
  } catch (error) {
    console.error('Error listando solicitudes:', error.message);
    res.status(500).json({ message: 'Error al listar solicitudes', error: error.message });
  }
};

export let obtenerSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        s.id, s.titulo, s.descripcion, s.estado, s.fecha_creacion,
        s.solicitante_id, s.responsable_id, s.tipo,
        u1.nombre as solicitante_nombre, u1.correo as solicitante_correo, u1.rol as solicitante_rol,
        u2.nombre as responsable_nombre, u2.correo as responsable_correo, u2.rol as responsable_rol,
        t.nombre as tipo_nombre
      FROM solicitudes s
      LEFT JOIN usuarios u1 ON s.solicitante_id = u1.id
      LEFT JOIN usuarios u2 ON s.responsable_id = u2.id
      LEFT JOIN tipos t ON s.tipo = t.id
      WHERE s.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    
    const row = result.rows[0];
    const solicitud = {
      id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      estado: row.estado,
      fecha_creacion: row.fecha_creacion,
      solicitante_id: row.solicitante_id,
      responsable_id: row.responsable_id,
      tipo: row.tipo,
      tipo_nombre: row.tipo_nombre,
      solicitante: {
        id: row.solicitante_id,
        nombre: row.solicitante_nombre,
        correo: row.solicitante_correo,
        rol: row.solicitante_rol
      },
      responsable: {
        id: row.responsable_id,
        nombre: row.responsable_nombre,
        correo: row.responsable_correo,
        rol: row.responsable_rol
      }
    };
    
    res.json(solicitud);
  } catch (error) {
    console.error('Error obteniendo solicitud:', error.message);
    res.status(500).json({ message: 'Error al obtener solicitud', error: error.message });
  }
};

export let crearSolicitud = async (req, res) => {
  try {
    const { titulo, descripcion, tipo, solicitante_id, responsable_id } = req.body;

    if (!titulo || !descripcion || !tipo || !solicitante_id || !responsable_id) {
      return res.status(400).json({ 
        message: 'Campos requeridos: titulo, descripcion, tipo, solicitante_id, responsable_id' 
      });
    }

    const result = await pool.query(
      'INSERT INTO solicitudes (titulo, descripcion, solicitante_id, responsable_id, tipo, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [titulo, descripcion, solicitante_id, responsable_id, tipo, 'pendiente']
    );
    
    const solicitud = result.rows[0];
    try {
      const responsableResult = await pool.query(
        'SELECT nombre, correo FROM usuarios WHERE id = $1',
        [responsable_id]
      );

      const solicitanteResult = await pool.query(
        'SELECT nombre, correo FROM usuarios WHERE id = $1',
        [solicitante_id]
      );

      if (responsableResult.rows.length > 0 && solicitanteResult.rows.length > 0) {
        const responsable = responsableResult.rows[0];
        const solicitante = solicitanteResult.rows[0];

        
        await enviarNotificacionNuevaSolicitud(
          responsable.correo,
          responsable.nombre,
          titulo,
          solicitante.nombre,
          solicitud.id
        );

        console.log('📧 Correo de notificación enviado al responsable');
      }
    } catch (emailError) {
      console.error('⚠️ Error enviando correo de notificación:', emailError.message);
      
    }
    
    res.status(201).json(solicitud);
  } catch (error) {
    console.error('Error creando solicitud:', error.message);
    res.status(500).json({ message: 'Error al crear solicitud', error: error.message });
  }
};

export let actualizarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, tipo, responsable_id } = req.body;

    const result = await pool.query(
      'UPDATE solicitudes SET titulo = $1, descripcion = $2, tipo = $3, responsable_id = $4 WHERE id = $5 RETURNING *',
      [titulo, descripcion, tipo, responsable_id, id]
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
    const { comentario, usuario_id } = req.body;

    if (!comentario) {
      return res.status(400).json({ message: 'El comentario es requerido' });
    }

    if (!usuario_id) {
      return res.status(400).json({ message: 'El usuario_id es requerido' });
    }

    
    const solicitudAnterior = await pool.query(
      'SELECT s.titulo, s.solicitante_id, u.nombre as solicitante_nombre, u.correo as solicitante_correo FROM solicitudes s LEFT JOIN usuarios u ON s.solicitante_id = u.id WHERE s.id = $1',
      [id]
    );

    if (solicitudAnterior.rows.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    
    const responsableResult = await pool.query(
      'SELECT nombre FROM usuarios WHERE id = $1',
      [usuario_id]
    );

    
    const solicitudResult = await pool.query(
      'UPDATE solicitudes SET estado = $1, fecha_aprobacion = NOW() WHERE id = $2 RETURNING *',
      ['aprobada', id]
    );
    
    if (solicitudResult.rows.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    
    await pool.query(
      'INSERT INTO historial (solicitud_id, usuario_id, accion, comentario) VALUES ($1, $2, $3, $4)',
      [id, usuario_id, 'aprobar', comentario]
    );

    
    try {
      const solicitante = solicitudAnterior.rows[0];
      const responsable = responsableResult.rows[0] || { nombre: 'Responsable' };

      if (solicitante.solicitante_correo) {
        await enviarNotificacionAprobada(
          solicitante.solicitante_correo,
          solicitante.solicitante_nombre,
          solicitante.titulo,
          responsable.nombre,
          comentario
        );
        console.log('📧 Correo de aprobación enviado al solicitante');
      }
    } catch (emailError) {
      console.error('⚠️ Error enviando correo de aprobación:', emailError.message);
      
    }

    res.json(solicitudResult.rows[0]);
  } catch (error) {
    console.error('Error aprobando solicitud:', error.message);
    res.status(500).json({ message: 'Error al aprobar solicitud', error: error.message });
  }
};

export let rechazarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo_rechazo, usuario_id } = req.body;

    if (!motivo_rechazo) {
      return res.status(400).json({ message: 'El motivo del rechazo es requerido' });
    }

    if (!usuario_id) {
      return res.status(400).json({ message: 'El usuario_id es requerido' });
    }

    
    const solicitudAnterior = await pool.query(
      'SELECT s.titulo, s.solicitante_id, u.nombre as solicitante_nombre, u.correo as solicitante_correo FROM solicitudes s LEFT JOIN usuarios u ON s.solicitante_id = u.id WHERE s.id = $1',
      [id]
    );

    if (solicitudAnterior.rows.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    
    const responsableResult = await pool.query(
      'SELECT nombre FROM usuarios WHERE id = $1',
      [usuario_id]
    );

    
    const solicitudResult = await pool.query(
      'UPDATE solicitudes SET estado = $1, fecha_rechazo = NOW(), motivo_rechazo = $3 WHERE id = $2 RETURNING *',
      ['rechazada', id, motivo_rechazo]
    );
    
    if (solicitudResult.rows.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    
    await pool.query(
      'INSERT INTO historial (solicitud_id, usuario_id, accion, comentario) VALUES ($1, $2, $3, $4)',
      [id, usuario_id, 'rechazar', motivo_rechazo]
    );

    
    try {
      const solicitante = solicitudAnterior.rows[0];
      const responsable = responsableResult.rows[0] || { nombre: 'Responsable' };

      if (solicitante.solicitante_correo) {
        await enviarNotificacionRechazada(
          solicitante.solicitante_correo,
          solicitante.solicitante_nombre,
          solicitante.titulo,
          responsable.nombre,
          motivo_rechazo
        );
        console.log('📧 Correo de rechazo enviado al solicitante');
      }
    } catch (emailError) {
      console.error('⚠️ Error enviando correo de rechazo:', emailError.message);
      
    }

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