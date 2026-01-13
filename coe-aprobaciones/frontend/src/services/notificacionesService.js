import api from './api.js';

export const notificacionesService = {
  // Obtener bandeja de usuario
  obtenerBandeja: (usuarioId) => 
    api.get(`/notificaciones/${usuarioId}`),

  // Enviar notificación/correo
  enviar: (notificacion) => 
    api.post('/notificaciones/enviar', notificacion),

  // Marcar como leída
  marcarLeida: (id) => 
    api.put(`/notificaciones/${id}/leer`, {}),

  // Eliminar notificación
  eliminar: (id) => 
    api.delete(`/notificaciones/${id}`),
};