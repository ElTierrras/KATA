import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';
import { useSolicitudStore } from '../store/useSolicitudStore.js';

export default function CrearSolicitud() {
  const { usuario } = useAuthStore();
  const { crearSolicitud, listarTipos, tipos, loading, error } = useSolicitudStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo_solicitud: '',
    monto: '',
  });
  const [enviando, setEnviando] = useState(false);
  const [errorLocal, setErrorLocal] = useState('');
  const [tiposLoading, setTiposLoading] = useState(true);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!usuario) {
      navigate('/login');
    }
  }, [usuario, navigate]);

  // Cargar tipos de solicitudes
  useEffect(() => {
    const cargarTipos = async () => {
      setTiposLoading(true);
      try {
        await listarTipos();
      } catch (err) {
        console.error('Error cargando tipos:', err);
        setErrorLocal('Error al cargar los tipos de solicitudes');
      } finally {
        setTiposLoading(false);
      }
    };

    cargarTipos();
  }, [listarTipos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorLocal('');

    // Validaciones
    if (!formData.titulo.trim()) {
      setErrorLocal('El título es requerido');
      return;
    }
    if (!formData.tipo_solicitud.trim()) {
      setErrorLocal('Debes seleccionar un tipo de solicitud');
      return;
    }
    if (!formData.monto || formData.monto <= 0) {
      setErrorLocal('El monto debe ser mayor a 0');
      return;
    }

    setEnviando(true);
    try {
      console.log('📝 Creando solicitud:', formData);
      
      const nuevaSolicitud = await crearSolicitud({
        ...formData,
        monto: parseFloat(formData.monto),
        solicitante_id: usuario.id,
        estado: 'pendiente',
      });

      console.log('✅ Solicitud creada:', nuevaSolicitud);
      alert('Solicitud creada exitosamente');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creando solicitud:', err);
      setErrorLocal(err.message || 'Error al crear la solicitud');
    } finally {
      setEnviando(false);
    }
  };

  // Manejo seguro de tipos
  const tiposArray = Array.isArray(tipos) ? tipos : [];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft size={20} />
            Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Solicitud</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {(errorLocal || error) && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {errorLocal || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
                Título <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Título de la solicitud"
              />
            </div>

            {/* Tipo de Solicitud */}
            <div>
              <label htmlFor="tipo_solicitud" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Solicitud <span className="text-red-600">*</span>
              </label>
              <select
                id="tipo_solicitud"
                name="tipo_solicitud"
                value={formData.tipo_solicitud}
                onChange={handleChange}
                required
                disabled={tiposLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">
                  {tiposLoading ? '⏳ Cargando tipos...' : '-- Selecciona un tipo --'}
                </option>
                {tiposArray.map((tipo) => (
                  <option key={tipo.id} value={tipo.nombre || tipo.id}>
                    {tipo.nombre || tipo.id}
                  </option>
                ))}
              </select>
              {tiposLoading && (
                <p className="text-sm text-gray-600 mt-1">Cargando tipos de solicitudes...</p>
              )}
              {tiposArray.length === 0 && !tiposLoading && (
                <p className="text-sm text-red-600 mt-1">No hay tipos de solicitudes disponibles</p>
              )}
            </div>

            {/* Monto */}
            <div>
              <label htmlFor="monto" className="block text-sm font-medium text-gray-700 mb-2">
                Monto <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-600">$</span>
                <input
                  type="number"
                  id="monto"
                  name="monto"
                  value={formData.monto}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe tu solicitud en detalle..."
              />
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={enviando || tiposLoading}
                className="flex items-center justify-center gap-2 flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                <Send size={20} />
                {enviando ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}