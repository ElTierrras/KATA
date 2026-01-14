import api from './api.js';

console.log('📦 usuariosService cargado');

export const usuariosService = {
  
  listar: () => {
    console.log('📋 Llamando: listar usuarios');
    return api.get('/usuarios');
  },

  
  obtenerPorId: (id) => {
    console.log('📋 Llamando: obtener usuario por ID:', id);
    return api.get(`/usuarios/${id}`);
  },

  
  crear: (usuario) => {
    console.log('📝 Llamando: crear usuario');
    return api.post('/registro', usuario);
  },

  
  actualizar: (id, usuario) => {
    console.log('✏️ Llamando: actualizar usuario:', id);
    return api.put(`/usuarios/${id}`, usuario);
  },

  
  eliminar: (id) => {
    console.log('🗑️ Llamando: eliminar usuario:', id);
    return api.delete(`/usuarios/${id}`);
  },

  
  login: (credentials) => {
    console.log('🔐 Llamando: login con', credentials.correo);
    return api.post('/login', credentials);
  },
};