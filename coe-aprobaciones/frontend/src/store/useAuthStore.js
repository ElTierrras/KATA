import { create } from 'zustand';
import { usuariosService } from '../services/usuariosService.js';

export const useAuthStore = create((set) => ({
  usuario: JSON.parse(localStorage.getItem('usuario')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (correo, contrasena) => {
    console.log('🔐 Iniciando login:', { correo });
    set({ loading: true, error: null });
    try {
      console.log('📞 Llamando usuariosService.login()');
      const response = await usuariosService.login({ correo, contrasena });
      
      console.log('✅ Login exitoso:', response);
      
      localStorage.setItem('usuario', JSON.stringify(response));
      localStorage.setItem('token', response.id);
      
      set({
        usuario: response,
        token: response.id,
        isAuthenticated: true,
        loading: false,
      });

      return response;
    } catch (error) {
      console.error('❌ Error en login:', error);
      const errorMessage = error.message || 'Error al iniciar sesión';
      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },

  registro: async (nombre, correo, contrasena, rol = 'solicitante') => {
    console.log('📝 Iniciando registro:', { nombre, correo, rol });
    set({ loading: true, error: null });
    try {
      console.log('📞 Llamando usuariosService.crear()');
      const response = await usuariosService.crear({
        nombre,
        correo,
        contrasena,
        rol,
      });

      console.log('✅ Registro exitoso:', response);

      localStorage.setItem('usuario', JSON.stringify(response));
      localStorage.setItem('token', response.id);

      set({
        usuario: response,
        token: response.id,
        isAuthenticated: true,
        loading: false,
      });

      return response;
    } catch (error) {
      console.error('❌ Error en registro:', error);
      const errorMessage = error.message || 'Error al registrarse';
      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },

  logout: () => {
    console.log('🚪 Cerrando sesión');
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    set({
      usuario: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  limpiarError: () => set({ error: null }),
}));