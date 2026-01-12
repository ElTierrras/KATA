import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSolicitudStore } from '../store/useSolicitudStore';
import { useAuthStore } from '../store/useAuthStore';
import { Badge } from '../components/Badge';
import { getHistorialSolicitud } from '../services/historialService';
import { MessageSquare, CheckCircle, XCircle } from 'lucide-react';

export const DetalleSolicitud = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { fetchDetalleSolicitud, aprobarSolicitud, rechazarSolicitud, agregarComentario } =
    useSolicitudStore();

  const [solicitud, setSolicitud] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comentario, setComentario] = useState('');
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [mostrarModalRechazo, setMostrarModalRechazo] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [solicitudData, historialData] = await Promise.all([
          fetchDetalleSolicitud(id),
          getHistorialSolicitud(id),
        ]);
        setSolicitud(solicitudData);
        setHistorial(historialData);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id]);

  const handleAprobar = async () => {
    try {
      await aprobarSolicitud(id);
      setSolicitud((prev) => ({ ...prev, estado: 'aprobada' }));
    } catch (error) {
      console.error('Error aprobando:', error);
    }
  };

  const handleRechazar = async () => {
    try {
      await rechazarSolicitud(id, motivoRechazo);
      setSolicitud((prev) => ({ ...prev, estado: 'rechazada' }));
      setMostrarModalRechazo(false);
      setMotivoRechazo('');
    } catch (error) {
      console.error('Error rechazando:', error);
    }
  };

  const handleComentario = async (e) => {
    e.preventDefault();
    try {
      await agregarComentario(id, comentario, user?.id);
      setComentario('');
    } catch (error) {
      console.error('Error agregando comentario:', error);
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (!solicitud) return <div className="p-8 text-center text-red-600">Solicitud no encontrada</div>;

  const esAprobador = user?.rol === 'responsable' || user?.rol === 'admin';
  const puedeAprobar = esAprobador && solicitud.estado === 'pendiente';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{solicitud.titulo}</h1>
              <p className="text-gray-600 mt-2">{solicitud.descripcion}</p>
            </div>
            <Badge estado={solicitud.estado} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Solicitante:</span>
              <p className="text-gray-600">{solicitud.solicitante_id}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Responsable:</span>
              <p className="text-gray-600">{solicitud.responsable_id}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Fecha Creación:</span>
              <p className="text-gray-600">{new Date(solicitud.fecha_creacion).toLocaleString()}</p>
            </div>
            {solicitud.estado !== 'pendiente' && (
              <div>
                <span className="font-semibold text-gray-700">Fecha {solicitud.estado}:</span>
                <p className="text-gray-600">
                  {new Date(
                    solicitud.estado === 'aprobada'
                      ? solicitud.fecha_aprobacion
                      : solicitud.fecha_rechazo
                  ).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {solicitud.motivo_rechazo && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded">
              <p className="text-red-800">
                <span className="font-semibold">Motivo del rechazo:</span> {solicitud.motivo_rechazo}
              </p>
            </div>
          )}
        </div>

        {/* Botones de acción (solo para aprobadores) */}
        {puedeAprobar && (
          <div className="bg-white rounded-lg shadow p-6 mb-6 flex gap-4">
            <button
              onClick={handleAprobar}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} /> Aprobar
            </button>
            <button
              onClick={() => setMostrarModalRechazo(true)}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <XCircle size={20} /> Rechazar
            </button>
          </div>
        )}

        {/* Modal de rechazo */}
        {mostrarModalRechazo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Motivo del rechazo</h2>
              <textarea
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 mb-4"
                rows="4"
                placeholder="Explica el motivo del rechazo"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleRechazar}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
                >
                  Rechazar
                </button>
                <button
                  onClick={() => setMostrarModalRechazo(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Historial */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Historial</h2>
          <div className="space-y-4">
            {historial.length === 0 ? (
              <p className="text-gray-500">Sin historial</p>
            ) : (
              historial.map((evento) => (
                <div key={evento.id} className="border-l-4 border-blue-600 pl-4 py-2">
                  <p className="font-semibold text-gray-900">{evento.accion}</p>
                  {evento.comentario && (
                    <p className="text-gray-700 mt-1">{evento.comentario}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(evento.fecha_creacion).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Comentarios */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare size={24} /> Comentarios
          </h2>

          <form onSubmit={handleComentario} className="mb-6">
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 mb-3"
              rows="3"
              placeholder="Agregar un comentario..."
            />
            <button
              type="submit"
              disabled={!comentario.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              Comentar
            </button>
          </form>
        </div>

        {/* Botón volver */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400"
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
};