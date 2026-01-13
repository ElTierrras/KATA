import { create } from 'zustand';
import { solicitudesService } from '../services/solicitudesService.js';
import { tiposService } from '../services/tiposService.js';

export const useSolicitudStore = create((set) => ({
  solicitudes: [],
  tipos: [], // ✅ Inicializar como array vacío
  solicitudActual: null,
  historial: [],
  loading: false,
  error: null,

  listarSolicitudes: async () => {
    console.log('📞 Llamando listarSolicitudes del store');
    set({ loading: true, error: null });
    try {
      const data = await solicitudesService.listar();
      console.log('✅ Solicitudes cargadas:', data);
      set({ solicitudes: data || [], loading: false });
      return data;
    } catch (error) {
      console.error('❌ Error cargando solicitudes:', error.message);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // ✅ Listar tipos
  listarTipos: async () => {
    console.log('📞 Cargando tipos de solicitudes');
    set({ loading: true, error: null });
    try {
      const data = await tiposService.listar();
      console.log('✅ Tipos cargados:', data);
      set({ tipos: data || [], loading: false });
      return data;
    } catch (error) {
      console.error('❌ Error cargando tipos:', error.message);
      set({ tipos: [], loading: false });
      // No lanzar error, solo registrar
      return [];
    }
  },

  obtenerSolicitud: async (id) => {
    console.log('📞 Obteniendo solicitud:', id);
    set({ loading: true, error: null });
    try {
      const data = await solicitudesService.obtenerPorId(id);
      console.log('✅ Solicitud obtenida:', data);
      set({ solicitudActual: data, loading: false });
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo solicitud:', error.message);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  crearSolicitud: async (solicitud) => {
    console.log('📝 Creando solicitud:', solicitud);
    set({ loading: true, error: null });
    try {
      const data = await solicitudesService.crear(solicitud);
      console.log('✅ Solicitud creada:', data);
      set((state) => ({
        solicitudes: [...state.solicitudes, data],
        loading: false,
      }));
      return data;
    } catch (error) {
      console.error('❌ Error creando solicitud:', error.message);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  aprobarSolicitud: async (id, comentario, usuario_id) => {
    console.log('✅ Aprobando solicitud:', id);
    set({ loading: true, error: null });
    try {
      const data = await solicitudesService.aprobar(id, comentario, usuario_id);
      console.log('✅ Solicitud aprobada:', data);
      set((state) => ({
        solicitudes: state.solicitudes.map((s) => s.id === id ? data : s),
        solicitudActual: data,
        loading: false,
      }));
      return data;
    } catch (error) {
      console.error('❌ Error aprobando:', error.message);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  rechazarSolicitud: async (id, motivo, usuario_id) => {
    console.log('❌ Rechazando solicitud:', id);
    set({ loading: true, error: null });
    try {
      const data = await solicitudesService.rechazar(id, motivo, usuario_id);
      console.log('❌ Solicitud rechazada:', data);
      set((state) => ({
        solicitudes: state.solicitudes.map((s) => s.id === id ? data : s),
        solicitudActual: data,
        loading: false,
      }));
      return data;
    } catch (error) {
      console.error('❌ Error rechazando:', error.message);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  obtenerHistorial: async (id) => {
    console.log('📜 Obteniendo historial:', id);
    set({ loading: true, error: null });
    try {
      const data = await solicitudesService.obtenerHistorial(id);
      console.log('✅ Historial obtenido:', data);
      set({ historial: data || [], loading: false });
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo historial:', error.message);
      set({ historial: [], loading: false });
      return [];
    }
  },

  limpiarError: () => set({ error: null }),
}));