import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Mail } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';
import { notificacionesService } from '../services/notificacionesService.js';

export default function Notificaciones() {
  const { usuario } = useAuthStore();
  const navigate = useNavigate();
  
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!usuario) {
      navigate('/login');
    }
  }, [usuario, navigate]);

  // Cargar notificaciones
  useEffect(() => {
    if (usuario?.id) {
      cargarNotificaciones();
    }
  }, [usuario]);

  const cargarNotificaciones = async () => {
    setLoading(true);
    try {
      console.log('📬 Cargando notificaciones del usuario:', usuario.id);
      const data = await notificacionesService.obtenerBandeja(usuario.id);
      console.log('✅ Notificaciones cargadas:', data);
      setNotificaciones(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando notificaciones:', err);
      setError('Error al cargar las notificaciones');
      setNotificaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await notificacionesService.eliminar(id);
      setNotificaciones((prev) => prev.filter((n) => n.id !== id));
      alert('Notificación eliminada');
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const handleMarcarLeida = async (id) => {
    try {
      await notificacionesService.marcarLeida(id);
      cargarNotificaciones();
    } catch (err) {
      console.error('Error marcando como leída:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft size={20} />
            Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Mis Notificaciones</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-600">
            Cargando notificaciones...
          </div>
        ) : notificaciones.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Mail size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No hay notificaciones</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notificaciones.map((notificacion) => (
              <div
                key={notificacion.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {notificacion.asunto}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(notificacion.fecha_envio).toLocaleString()}
                    </p>
                  </div>
                  {!notificacion.leida && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      Nueva
                    </span>
                  )}
                </div>

                <p className="text-gray-700 mt-3 whitespace-pre-wrap">
                  {notificacion.cuerpo}
                </p>

                <div className="flex gap-2 mt-4">
                  {!notificacion.leida && (
                    <button
                      onClick={() => handleMarcarLeida(notificacion.id)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Marcar como leída
                    </button>
                  )}
                  <button
                    onClick={() => handleEliminar(notificacion.id)}
                    className="ml-auto text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
