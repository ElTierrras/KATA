import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';
import { useSolicitudStore } from '../store/useSolicitudStore.js';
import { useToastStore } from '../store/useToastStore.js';
import { usuariosService } from '../services/usuariosService.js';

export default function CrearSolicitud() {
  const { usuario } = useAuthStore();
  const { crearSolicitud, listarTipos, tipos, loading, error } = useSolicitudStore();
  const { success, error: showError } = useToastStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: '',
    solicitante_id: '',
    responsable_id: '',
  });

  const [usuarios, setUsuarios] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [errorLocal, setErrorLocal] = useState('');
  const [tiposLoading, setTiposLoading] = useState(true);
  const [usuariosLoading, setUsuariosLoading] = useState(true);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!usuario) {
      navigate('/login');
    } else {
      // Establecer automáticamente el solicitante como usuario actual
      setFormData((prev) => ({
        ...prev,
        solicitante_id: usuario.id,
      }));
    }
  }, [usuario, navigate]);

  // Cargar tipos de solicitudes y usuarios
  useEffect(() => {
    const cargarDatos = async () => {
      setTiposLoading(true);
      setUsuariosLoading(true);
      try {
        // Cargar tipos
        await listarTipos();

        // Cargar usuarios
        const usuariosData = await usuariosService.listar();
        setUsuarios(Array.isArray(usuariosData) ? usuariosData : []);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setErrorLocal('Error al cargar los datos necesarios');
      } finally {
        setTiposLoading(false);
        setUsuariosLoading(false);
      }
    };

    cargarDatos();
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
    if (!formData.descripcion.trim()) {
      setErrorLocal('La descripción es requerida');
      return;
    }
    if (!formData.tipo) {
      setErrorLocal('Debes seleccionar un tipo de solicitud');
      return;
    }
    if (!formData.responsable_id) {
      setErrorLocal('Debes seleccionar un responsable');
      return;
    }

    setEnviando(true);
    try {
      console.log('📝 Creando solicitud:', formData);

      const nuevaSolicitud = await crearSolicitud({
        ...formData,
        estado: 'pendiente',
      });

      console.log('✅ Solicitud creada:', nuevaSolicitud);
      success('Solicitud creada exitosamente');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      console.error('Error creando solicitud:', err);
      showError(err.message || 'Error al crear la solicitud');
    } finally {
      setEnviando(false);
    }
  };

  // Manejo seguro de datos
  const tiposArray = Array.isArray(tipos) ? tipos : [];
  const usuariosArray = Array.isArray(usuarios) ? usuarios : [];
  const responsablesArray = usuariosArray.filter(
    (u) => u.rol === 'responsable' || u.rol === 'admin'
  );

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

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción <span className="text-red-600">*</span>
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe tu solicitud en detalle..."
              />
            </div>

            {/* Solicitante */}
            <div>
              <label htmlFor="solicitante_id" className="block text-sm font-medium text-gray-700 mb-2">
                Solicitante (Usuario de red) <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="solicitante_id"
                disabled
                value={usuario?.nombre || usuario?.correo || 'Cargando...'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">Tu usuario está preseleccionado automáticamente</p>
            </div>

            {/* Responsable */}
            <div>
              <label htmlFor="responsable_id" className="block text-sm font-medium text-gray-700 mb-2">
                Responsable (Usuario que debe aprobar) <span className="text-red-600">*</span>
              </label>
              <select
                id="responsable_id"
                name="responsable_id"
                value={formData.responsable_id}
                onChange={handleChange}
                required
                disabled={usuariosLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">
                  {usuariosLoading ? '⏳ Cargando responsables...' : '-- Selecciona un responsable --'}
                </option>
                {responsablesArray.map((resp) => (
                  <option key={resp.id} value={resp.id}>
                    {resp.nombre} ({resp.correo})
                  </option>
                ))}
              </select>
              {usuariosLoading && (
                <p className="text-sm text-gray-600 mt-1">Cargando responsables...</p>
              )}
              {responsablesArray.length === 0 && !usuariosLoading && (
                <p className="text-sm text-red-600 mt-1">No hay responsables disponibles</p>
              )}
            </div>

            {/* Tipo de Solicitud */}
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Solicitud <span className="text-red-600">*</span>
              </label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
                disabled={tiposLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">
                  {tiposLoading ? '⏳ Cargando tipos...' : '-- Selecciona un tipo --'}
                </option>
                {tiposArray.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
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

            {/* Botones */}
            <div className="flex gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={enviando || tiposLoading || usuariosLoading}
                className="flex items-center justify-center gap-2 flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                <Send size={20} />
                {enviando ? 'Enviando...' : 'Crear Solicitud'}
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