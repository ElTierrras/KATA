import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSolicitudStore } from '../store/useSolicitudStore';
import { useAuthStore } from '../store/useAuthStore';
import { Badge } from '../components/Badge';
import { NotificationBell } from '../components/NotificationBell';
import { Plus, Eye } from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { solicitudes, loading, fetchSolicitudes } = useSolicitudStore();
  const [filtro, setFiltro] = useState('todas');

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const solicitudesFiltradas = solicitudes.filter((s) => {
    if (filtro === 'pendientes') return s.estado === 'pendiente';
    if (filtro === 'aprobadas') return s.estado === 'aprobada';
    if (filtro === 'rechazadas') return s.estado === 'rechazada';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Bienvenido, {user?.nombre}</p>
          </div>
          <div className="flex items-center gap-4">
            {user?.id && <NotificationBell usuarioId={user.id} />}
            <button
              onClick={() => navigate('/crear-solicitud')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus size={20} /> Nueva Solicitud
            </button>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="mb-6 flex gap-4">
          {['todas', 'pendientes', 'aprobadas', 'rechazadas'].map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filtro === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-100'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Tabla de solicitudes */}
        {loading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Título</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Solicitante</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Fecha</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No hay solicitudes
                    </td>
                  </tr>
                ) : (
                  solicitudesFiltradas.map((solicitud) => (
                    <tr key={solicitud.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{solicitud.titulo}</div>
                        <div className="text-sm text-gray-500">{solicitud.descripcion.substring(0, 50)}...</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{solicitud.solicitante_id}</td>
                      <td className="px-6 py-4">
                        <Badge estado={solicitud.estado} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(solicitud.fecha_creacion).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/solicitud/${solicitud.id}`)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Eye size={18} /> Ver
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};