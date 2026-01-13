import nodemailer from 'nodemailer';
import pool from '../db.js';

// Configurar el transportador de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Envía un correo de notificación cuando se crea una solicitud
 * @param {string} destinatario - Email del responsable
 * @param {string} nombreResponsable - Nombre del responsable
 * @param {string} titulo - Título de la solicitud
 * @param {string} nombreSolicitante - Nombre del solicitante
 * @param {string} solicitudId - ID de la solicitud
 */
export const enviarNotificacionNuevaSolicitud = async (
  destinatario,
  nombreResponsable,
  titulo,
  nombreSolicitante,
  solicitudId
) => {
  const asunto = `Nueva solicitud de aprobación: ${titulo}`;
  const cuerpo = `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>Nueva Solicitud de Aprobación</h2>
        <p>Hola <strong>${nombreResponsable}</strong>,</p>
        <p><strong>${nombreSolicitante}</strong> ha creado una nueva solicitud que requiere tu aprobación:</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Título:</strong> ${titulo}</p>
          <p><strong>Solicitante:</strong> ${nombreSolicitante}</p>
          <p><strong>Estado:</strong> Pendiente de aprobación</p>
        </div>
        
        <p>Por favor, accede a la plataforma para revisar los detalles completos y tomar una decisión.</p>
        
        <p>Saludos,<br>Sistema de Aprobaciones</p>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: destinatario,
      subject: asunto,
      html: cuerpo
    });
    
    console.log(`✅ Correo enviado a ${destinatario}`);
    return true;
  } catch (error) {
    console.error(`❌ Error enviando correo a ${destinatario}:`, error.message);
    return false;
  }
};

/**
 * Envía un correo cuando una solicitud es aprobada
 */
export const enviarNotificacionAprobada = async (
  destinatario,
  nombreSolicitante,
  titulo,
  nombreResponsable,
  comentario
) => {
  const asunto = `Solicitud aprobada: ${titulo}`;
  const cuerpo = `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2 style="color: #28a745;">Solicitud Aprobada ✅</h2>
        <p>Hola <strong>${nombreSolicitante}</strong>,</p>
        <p>Tu solicitud ha sido <strong style="color: #28a745;">aprobada</strong> por <strong>${nombreResponsable}</strong>.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Solicitud:</strong> ${titulo}</p>
          <p><strong>Aprobado por:</strong> ${nombreResponsable}</p>
          <p><strong>Comentario:</strong> ${comentario}</p>
        </div>
        
        <p>Saludos,<br>Sistema de Aprobaciones</p>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: destinatario,
      subject: asunto,
      html: cuerpo
    });
    
    console.log(`✅ Correo de aprobación enviado a ${destinatario}`);
    return true;
  } catch (error) {
    console.error(`❌ Error enviando correo a ${destinatario}:`, error.message);
    return false;
  }
};

/**
 * Envía un correo cuando una solicitud es rechazada
 */
export const enviarNotificacionRechazada = async (
  destinatario,
  nombreSolicitante,
  titulo,
  nombreResponsable,
  motivo
) => {
  const asunto = `Solicitud rechazada: ${titulo}`;
  const cuerpo = `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2 style="color: #dc3545;">Solicitud Rechazada ❌</h2>
        <p>Hola <strong>${nombreSolicitante}</strong>,</p>
        <p>Tu solicitud ha sido <strong style="color: #dc3545;">rechazada</strong> por <strong>${nombreResponsable}</strong>.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Solicitud:</strong> ${titulo}</p>
          <p><strong>Rechazado por:</strong> ${nombreResponsable}</p>
          <p><strong>Motivo:</strong> ${motivo}</p>
        </div>
        
        <p>Si tienes preguntas, por favor contacta al responsable.</p>
        <p>Saludos,<br>Sistema de Aprobaciones</p>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: destinatario,
      subject: asunto,
      html: cuerpo
    });
    
    console.log(`✅ Correo de rechazo enviado a ${destinatario}`);
    return true;
  } catch (error) {
    console.error(`❌ Error enviando correo a ${destinatario}:`, error.message);
    return false;
  }
};
