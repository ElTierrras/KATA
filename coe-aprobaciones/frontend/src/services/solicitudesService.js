import api from './api.js';

console.log('📦 solicitudesService cargado');

export const solicitudesService = {
  // Listar todas las solicitudes
  listar: () => {
    console.log('📋 Llamando: listar solicitudes');
    return api.get('/solicitudes');
  },

  // Obtener detalle de solicitud
  obtenerPorId: (id) => {
    console.log('📋 Llamando: obtener solicitud por ID:', id);
    return api.get(`/solicitudes/${id}`);
  },

  // Crear solicitud
  crear: (solicitud) => {
    console.log('📝 Llamando: crear solicitud');
    return api.post('/solicitudes', solicitud);
  },

  // Actualizar solicitud
  actualizar: (id, solicitud) => {
    console.log('✏️ Llamando: actualizar solicitud:', id);
    return api.put(`/solicitudes/${id}`, solicitud);
  },

  // Eliminar solicitud
  eliminar: (id) => {
    console.log('🗑️ Llamando: eliminar solicitud:', id);
    return api.delete(`/solicitudes/${id}`);
  },

  // Aprobar solicitud con comentario
  aprobar: (id, comentario, usuario_id) => {
    console.log('✅ Llamando: aprobar solicitud:', id);
    return api.put(`/solicitudes/${id}/aprobar`, { comentario, usuario_id });
  },

  // Rechazar solicitud con motivo
  rechazar: (id, motivo_rechazo, usuario_id) => {
    console.log('❌ Llamando: rechazar solicitud:', id);
    return api.put(`/solicitudes/${id}/rechazar`, { motivo_rechazo, usuario_id });
  },

  // Obtener historial de la solicitud
  obtenerHistorial: (id) => {
    console.log('📜 Llamando: obtener historial de solicitud:', id);
    return api.get(`/solicitudes/${id}/historial`);
  },
};