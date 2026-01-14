import pool from '../db.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export let enviarCorreo = async (req, res) => {
  const { destinatario, asunto, cuerpo, solicitud_id, usuario_id } = req.body;

  try {
    if (!destinatario || !asunto || !cuerpo || !usuario_id) {
      return res.status(400).json({ 
        message: 'Campos requeridos: destinatario, asunto, cuerpo, usuario_id' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(destinatario)) {
      return res.status(400).json({ message: 'Formato de correo inválido' });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: destinatario,
      subject: asunto,
      html: cuerpo
    });

    const result = await pool.query(
      'INSERT INTO notificaciones (usuario_id, solicitud_id, asunto, cuerpo, fecha_envio) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [usuario_id, solicitud_id || null, asunto, cuerpo]
    );

    res.status(201).json({ 
      message: 'Correo enviado correctamente', 
      notificacion: result.rows[0] 
    });
  } catch (error) {
    console.error('Error enviando correo:', error.message);
    
    if (error.code === '22P02' || error.code === '23503') {
      return res.status(400).json({ message: 'Usuario o solicitud no válido' });
    }

    res.status(500).json({ 
      message: 'Error al enviar correo', 
      error: error.message 
    });
  }
};

export let bandejaUsuario = async (req, res) => {
  const { usuario_id } = req.params;

  try {
    if (!usuario_id) {
      return res.status(400).json({ message: 'usuario_id es requerido' });
    }

    const result = await pool.query(
      'SELECT * FROM notificaciones WHERE usuario_id = $1 ORDER BY fecha_envio DESC',
      [usuario_id]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No hay notificaciones', notificaciones: [] });
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error.message);
    res.status(500).json({ 
      message: 'Error al obtener notificaciones', 
      error: error.message 
    });
  }
};