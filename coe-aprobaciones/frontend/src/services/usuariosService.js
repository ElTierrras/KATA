import api from './api.js';

console.log('📦 usuariosService cargado');

export const usuariosService = {
  // Listar todos los usuarios
  listar: () => {
    console.log('📋 Llamando: listar usuarios');
    return api.get('/usuarios');
  },

  // Obtener detalle de un usuario
  obtenerPorId: (id) => {
    console.log('📋 Llamando: obtener usuario por ID:', id);
    return api.get(`/usuarios/${id}`);
  },

  // Crear nuevo usuario
  crear: (usuario) => {
    console.log('📝 Llamando: crear usuario');
    return api.post('/registro', usuario);
  },

  // Actualizar usuario
  actualizar: (id, usuario) => {
    console.log('✏️ Llamando: actualizar usuario:', id);
    return api.put(`/usuarios/${id}`, usuario);
  },

  // Eliminar usuario
  eliminar: (id) => {
    console.log('🗑️ Llamando: eliminar usuario:', id);
    return api.delete(`/usuarios/${id}`);
  },

  // Iniciar sesión
  login: (credentials) => {
    console.log('🔐 Llamando: login con', credentials.correo);
    return api.post('/login', credentials);
  },
};