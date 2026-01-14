import api from './api.js';

console.log('📦 solicitudesService cargado');

export const solicitudesService = {
  
  listar: () => {
    console.log('📋 Llamando: listar solicitudes');
    return api.get('/solicitudes');
  },

  
  obtenerPorId: (id) => {
    console.log('📋 Llamando: obtener solicitud por ID:', id);
    return api.get(`/solicitudes/${id}`);
  },

  
  crear: (solicitud) => {
    console.log('📝 Llamando: crear solicitud');
    return api.post('/solicitudes', solicitud);
  },

  
  actualizar: (id, solicitud) => {
    console.log('✏️ Llamando: actualizar solicitud:', id);
    return api.put(`/solicitudes/${id}`, solicitud);
  },

 
  eliminar: (id) => {
    console.log('🗑️ Llamando: eliminar solicitud:', id);
    return api.delete(`/solicitudes/${id}`);
  },

  
  aprobar: (id, comentario, usuario_id) => {
    console.log('✅ Llamando: aprobar solicitud:', id);
    return api.put(`/solicitudes/${id}/aprobar`, { comentario, usuario_id });
  },

  
  rechazar: (id, motivo_rechazo, usuario_id) => {
    console.log('❌ Llamando: rechazar solicitud:', id);
    return api.put(`/solicitudes/${id}/rechazar`, { motivo_rechazo, usuario_id });
  },

  
  obtenerHistorial: (id) => {
    console.log('📜 Llamando: obtener historial de solicitud:', id);
    return api.get(`/solicitudes/${id}/historial`);
  },
};