import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const enviarNotificacion = async (notificacionData) => {
  try {
    const response = await axios.post(
      `${API_URL}/notificaciones/enviar`,
      notificacionData
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error al enviar notificación: ${error.message}`);
  }
};

export const getBandejaUsuario = async (usuarioId) => {
  try {
    const response = await axios.get(`${API_URL}/notificaciones/${usuarioId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener notificaciones: ${error.message}`);
  }
};