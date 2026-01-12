import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useSolicitudStore = create((set, get) => ({
  solicitudes: [],
  loading: false,
  error: null,

  // Obtener todas las solicitudes
  fetchSolicitudes: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/solicitudes`);
      set({ solicitudes: response.data, error: null });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  // Obtener detalle de una solicitud
  fetchDetalleSolicitud: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/solicitudes/${id}`);
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Crear nueva solicitud
  crearSolicitud: async (solicitudData) => {
    try {
      const response = await axios.post(`${API_URL}/solicitudes`, solicitudData);
      set((state) => ({
        solicitudes: [...state.solicitudes, response.data],
        error: null,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Aprobar solicitud
  aprobarSolicitud: async (id) => {
    try {
      const response = await axios.put(`${API_URL}/solicitudes/${id}/aprobar`);
      set((state) => ({
        solicitudes: state.solicitudes.map((s) =>
          s.id === id ? { ...s, estado: 'aprobada' } : s
        ),
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Rechazar solicitud
  rechazarSolicitud: async (id, motivo) => {
    try {
      const response = await axios.put(`${API_URL}/solicitudes/${id}/rechazar`, {
        motivo,
      });
      set((state) => ({
        solicitudes: state.solicitudes.map((s) =>
          s.id === id ? { ...s, estado: 'rechazada' } : s
        ),
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Agregar comentario
  agregarComentario: async (solicitudId, comentario, usuarioId) => {
    try {
      const response = await axios.put(
        `${API_URL}/solicitudes/${solicitudId}/comentar`,
        { comentario, usuario_id: usuarioId }
      );
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));