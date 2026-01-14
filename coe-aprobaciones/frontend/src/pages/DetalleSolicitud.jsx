import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, MessageSquare } from 'lucide-react';
import { useSolicitudStore } from '../store/useSolicitudStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { useToastStore } from '../store/useToastStore.js';
import Badge from '../components/Badge.jsx';

export default function DetalleSolicitud() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { solicitudActual, obtenerSolicitud, aprobarSolicitud, rechazarSolicitud, loading, error } = useSolicitudStore();
  const { usuario } = useAuthStore();
  const { success, error: showError } = useToastStore();
  
  const [comentario, setComentario] = useState('');
  const [motivo, setMotivo] = useState('');
  const [accion, setAccion] = useState(null); 
  const [enviando, setEnviando] = useState(false);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    if (id) {
      console.log('📄 Cargando solicitud:', id);
      obtenerSolicitud(id).catch((err) => {
        console.error('Error cargando solicitud:', err);
      });
      
      cargarHistorial(id);
    }
  }, [id, obtenerSolicitud]);

  const cargarHistorial = async (solicitudId) => {
    try {
      console.log('📜 Cargando historial de:', solicitudId);
    } catch (error) {
      console.error('Error cargando historial:', error);
    }
  };

  const handleAprobar = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) {
      showError('Por favor, agrega un comentario');
      return;
    }

    setEnviando(true);
    try {
      console.log('✅ Aprobando solicitud:', id);
      await aprobarSolicitud(id, comentario, usuario.id);
      
      agregarAlHistorial('aprobada', comentario);
      
      setComentario('');
      setAccion(null);
      success('Solicitud aprobada correctamente');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error('Error aprobando:', error);
      showError('Error al aprobar: ' + error.message);
    } finally {
      setEnviando(false);
    }
  };

  const handleRechazar = async (e) => {
    e.preventDefault();
    if (!motivo.trim()) {
      showError('Por favor, proporciona un motivo del rechazo');
      return;
    }

    setEnviando(true);
    try {
      console.log('❌ Rechazando solicitud:', id);
      await rechazarSolicitud(id, motivo, usuario.id);
      
      agregarAlHistorial('rechazada', motivo);
      
      setMotivo('');
      setAccion(null);
      success('Solicitud rechazada correctamente');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error('Error rechazando:', error);
      showError('Error al rechazar: ' + error.message);
    } finally {
      setEnviando(false);
    }
  };

  const agregarAlHistorial = (estado, comentarioTexto) => {
    const nuevoRegistro = {
      id: Date.now(),
      estado,
      fecha: new Date().toISOString(),
      usuario: usuario?.nombre || 'Usuario',
      comentario: comentarioTexto,
    };
    setHistorial((prev) => [nuevoRegistro, ...prev]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Cargando solicitud...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 text-red-700 p-6 rounded-lg">
          <p className="font-semibold">Error al cargar la solicitud</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!solicitudActual) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Solicitud no encontrada</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const puedeAprobar = solicitudActual.estado === 'pendiente' && 
                       solicitudActual.responsable_id === usuario?.id &&
                       (usuario?.rol === 'responsable' || usuario?.rol === 'admin');

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
          <h1 className="text-3xl font-bold text-gray-900">Detalle de Solicitud</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Información General */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {solicitudActual.titulo}
              </h2>
              <p className="text-gray-600 mt-2">
                ID: {solicitudActual.id}
              </p>
            </div>
            <Badge status={solicitudActual.estado} />
          </div>

          <div className="border-t pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 text-sm">Solicitante</p>
                <p className="text-gray-900 font-semibold">
                  {solicitudActual.solicitante?.nombre || 'N/A'}
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  {solicitudActual.solicitante?.correo || ''}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Responsable</p>
                <p className="text-gray-900 font-semibold">
                  {solicitudActual.responsable?.nombre || 'N/A'}
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  {solicitudActual.responsable?.correo || ''}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 text-sm">Tipo de Solicitud</p>
                <p className="text-gray-900 font-semibold">
                  {solicitudActual.tipo_nombre || solicitudActual.tipo || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Fecha de Creación</p>
                <p className="text-gray-900 font-semibold">
                  {new Date(solicitudActual.fecha_creacion).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {solicitudActual.descripcion && (
            <div className="mt-6 border-t pt-6">
              <p className="text-gray-600 text-sm">Descripción</p>
              <p className="text-gray-900 mt-2 whitespace-pre-wrap">
                {solicitudActual.descripcion}
              </p>
            </div>
          )}
        </div>

        {/* Información si NO puede aprobar */}
        {!puedeAprobar && solicitudActual.estado === 'pendiente' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-blue-900">
              💡 Esta solicitud está pendiente y solo <strong>{solicitudActual.responsable?.nombre}</strong> puede aprobarla o rechazarla.
            </p>
          </div>
        )}

        {/* Mensaje cuando la solicitud ya fue procesada */}
        {solicitudActual.estado !== 'pendiente' && (
          <div className={`rounded-lg p-6 mb-6 ${
            solicitudActual.estado === 'aprobada' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={solicitudActual.estado === 'aprobada' ? 'text-green-900' : 'text-red-900'}>
              {solicitudActual.estado === 'aprobada' 
                ? '✅ Esta solicitud ha sido aprobada.' 
                : '❌ Esta solicitud ha sido rechazada.'}
            </p>
          </div>
        )}

        {/* Acciones (si es aprobador y está pendiente) */}
        {puedeAprobar && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">⚠️ Acciones - Solicitud Pendiente de Aprobación</h3>
            <p className="text-gray-600 mb-4">Como responsable asignado, puedes aprobar o rechazar esta solicitud.</p>
            
            {accion === null && (
              <div className="flex gap-4">
                <button
                  onClick={() => setAccion('aprobar')}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <Check size={20} />
                  Aprobar
                </button>
                <button
                  onClick={() => setAccion('rechazar')}
                  className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  <X size={20} />
                  Rechazar
                </button>
              </div>
            )}

            {/* Formulario de Aprobación */}
            {accion === 'aprobar' && (
              <form onSubmit={handleAprobar} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentario (Requerido)
                  </label>
                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Agrega un comentario antes de aprobar..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="4"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={enviando}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                  >
                    <Check size={20} />
                    {enviando ? 'Aprobando...' : 'Confirmar Aprobación'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAccion(null);
                      setComentario('');
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {/* Formulario de Rechazo */}
            {accion === 'rechazar' && (
              <form onSubmit={handleRechazar} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo del Rechazo (Requerido)
                  </label>
                  <textarea
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Proporciona el motivo del rechazo..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows="4"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={enviando}
                    className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400"
                  >
                    <X size={20} />
                    {enviando ? 'Rechazando...' : 'Confirmar Rechazo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAccion(null);
                      setMotivo('');
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Historial de Cambios */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare size={24} />
            Historial de Cambios
          </h3>

          {historial.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No hay cambios registrados aún
            </p>
          ) : (
            <div className="space-y-4">
              {historial.map((registro) => (
                <div
                  key={registro.id}
                  className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Estado: <Badge status={registro.estado} />
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Usuario: {registro.usuario}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(registro.fecha).toLocaleString()}
                    </p>
                  </div>
                  {registro.comentario && (
                    <p className="text-gray-700 mt-2 whitespace-pre-wrap bg-white p-3 rounded">
                      "{registro.comentario}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}