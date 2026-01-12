import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getHistorialSolicitud = async (solicitudId) => {
  try {
    const response = await axios.get(
      `${API_URL}/historial/solicitudes/${solicitudId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener historial: ${error.message}`);
  }
};

export const getHistorialGlobal = async () => {
  try {
    const response = await axios.get(`${API_URL}/historial`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener historial: ${error.message}`);
  }
};