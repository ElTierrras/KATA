import api from './api.js';

console.log('📦 tiposService cargado');

export const tiposService = {
  
  listar: () => {
    console.log('📋 Llamando: listar tipos de solicitudes');
    return api.get('/tipos');
  },

  
  obtenerPorId: (id) => {
    console.log('📋 Llamando: obtener tipo por ID:', id);
    return api.get(`/tipos/${id}`);
  },

  
  crear: (tipo) => {
    console.log('📝 Llamando: crear tipo');
    return api.post('/tipos', tipo);
  },

  
  actualizar: (id, tipo) => {
    console.log('✏️ Llamando: actualizar tipo:', id);
    return api.put(`/tipos/${id}`, tipo);
  },

  
  eliminar: (id) => {
    console.log('🗑️ Llamando: eliminar tipo:', id);
    return api.delete(`/tipos/${id}`);
  },
};