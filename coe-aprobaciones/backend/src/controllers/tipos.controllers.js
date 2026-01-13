import pool from '../db.js';

export let listarTipos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tipos ORDER BY nombre ASC');
    console.log('✅ Tipos listados:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error listando tipos:', error.message);
    res.status(500).json({ message: 'Error al listar tipos', error: error.message });
  }
};

export let obtenerTipo = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM tipos WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tipo no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo tipo:', error.message);
    res.status(500).json({ message: 'Error al obtener tipo', error: error.message });
  }
};

export let crearTipo = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }

    const result = await pool.query(
      'INSERT INTO tipos (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [nombre, descripcion]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando tipo:', error.message);
    res.status(500).json({ message: 'Error al crear tipo', error: error.message });
  }
};

export let actualizarTipo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const result = await pool.query(
      'UPDATE tipos SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *',
      [nombre, descripcion, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tipo no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando tipo:', error.message);
    res.status(500).json({ message: 'Error al actualizar tipo', error: error.message });
  }
};

export let eliminarTipo = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tipos WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tipo no encontrado' });
    }
    
    res.json({ message: 'Tipo eliminado', tipo: result.rows[0] });
  } catch (error) {
    console.error('Error eliminando tipo:', error.message);
    res.status(500).json({ message: 'Error al eliminar tipo', error: error.message });
  }
};