import pool from '../db.js';
import nodemailer from 'nodemailer';

// Configurar el transportador de correo
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
    // Enviar correo
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: destinatario,
      subject: asunto,
      html: cuerpo
    });

    // Guardar notificación en base de datos
    const result = await pool.query(
      'INSERT INTO notificaciones (usuario_id, solicitud_id, asunto, cuerpo, fecha_envio) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [usuario_id, solicitud_id, asunto, cuerpo]
    );

    res.status(201).json({ message: 'Correo enviado correctamente', notificacion: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar correo', error: error.message });
  }
};

export let bandejaUsuario = async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM notificaciones WHERE usuario_id = $1 ORDER BY fecha_envio DESC',
      [usuario_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No hay notificaciones para este usuario' });
    }
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener notificaciones', error: error.message });
  }
};