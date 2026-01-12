import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSolicitudStore } from '../store/useSolicitudStore';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const CrearSolicitud = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { crearSolicitud } = useSolicitudStore();
  
  const [tipos, setTipos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    responsable_id: '',
    tipo: '',
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [tiposRes, usuariosRes] = await Promise.all([
          axios.get(`${API_URL}/tipos`),
          axios.get(`${API_URL}/usuarios`),
        ]);
        setTipos(tiposRes.data);
        setUsuarios(usuariosRes.data.filter((u) => u.id !== user?.id));
      } catch (err) {
        setError('Error cargando datos');
      }
    };
    cargarDatos();
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await crearSolicitud({
        ...formData,
        solicitante_id: user?.id,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error creando solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-6">Crear Nueva Solicitud</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Título</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Título de la solicitud"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              rows="5"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Describe tu solicitud en detalle"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Tipo de Solicitud</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Selecciona un tipo</option>
              {tipos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Responsable</label>
            <select
              name="responsable_id"
              value={formData.responsable_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Selecciona un responsable</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombre} ({usuario.rol})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Solicitud'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};