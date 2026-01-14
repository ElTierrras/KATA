import api from './api.js';

export const notificacionesService = {
  
  obtenerBandeja: (usuarioId) => 
    api.get(`/notificaciones/${usuarioId}`),

  
  enviar: (notificacion) => 
    api.post('/notificaciones/enviar', notificacion),

  
  marcarLeida: (id) => 
    api.put(`/notificaciones/${id}/leer`, {}),

  
  eliminar: (id) => 
    api.delete(`/notificaciones/${id}`),
};