import api from './api.js';

console.log('📦 tiposService cargado');

export const tiposService = {
  // Listar tipos de solicitudes
  listar: () => {
    console.log('📋 Llamando: listar tipos de solicitudes');
    return api.get('/tipos');
  },

  // Obtener tipo por ID
  obtenerPorId: (id) => {
    console.log('📋 Llamando: obtener tipo por ID:', id);
    return api.get(`/tipos/${id}`);
  },

  // Crear tipo
  crear: (tipo) => {
    console.log('📝 Llamando: crear tipo');
    return api.post('/tipos', tipo);
  },

  // Actualizar tipo
  actualizar: (id, tipo) => {
    console.log('✏️ Llamando: actualizar tipo:', id);
    return api.put(`/tipos/${id}`, tipo);
  },

  // Eliminar tipo
  eliminar: (id) => {
    console.log('🗑️ Llamando: eliminar tipo:', id);
    return api.delete(`/tipos/${id}`);
  },
};