import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Eye, InboxIcon, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';
import { useSolicitudStore } from '../store/useSolicitudStore.js';
import Badge from '../components/Badge.jsx';

export default function Dashboard() {
  const { usuario, logout } = useAuthStore();
  const { solicitudes, listarSolicitudes, loading, error } = useSolicitudStore();
  const [filter, setFilter] = useState('todas');
  const navigate = useNavigate();

  useEffect(() => {
    if (usuario) {
      console.log('📋 Cargando solicitudes del usuario:', usuario.id);
      listarSolicitudes();
    }
  }, [usuario, listarSolicitudes]);

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
    }
  }, [usuario, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCrearSolicitud = () => {
    navigate('/crear-solicitud');
  };

  const handleVerDetalle = (id) => {
    navigate(`/solicitudes/${id}`);
  };

  const solicitudesFiltradas = solicitudes.filter((solicitud) => {
    if (filter === 'todas') return true;
    return solicitud.estado === filter;
  });

  const solicitudesPendientes = solicitudes.filter(
    (solicitud) => 
      solicitud.estado === 'pendiente' && 
      solicitud.responsable_id === usuario?.id
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Bienvenido, {usuario?.nombre}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Bandeja de Entrada - Solicitudes Pendientes */}
        {solicitudesPendientes.length > 0 && (
          <div className="mb-8 bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={24} className="text-amber-600" />
              <h2 className="text-xl font-bold text-amber-900">📬 Bandeja de Entrada</h2>
              <span className="ml-auto bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {solicitudesPendientes.length} pendiente{solicitudesPendientes.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <p className="text-amber-800 mb-4">
              Tienes {solicitudesPendientes.length} solicitud{solicitudesPendientes.length !== 1 ? 'es' : ''} pendiente{solicitudesPendientes.length !== 1 ? 's' : ''} de aprobación:
            </p>
            
            <div className="space-y-3">
              {solicitudesPendientes.map((solicitud) => (
                <div
                  key={solicitud.id}
                  className="bg-white p-4 rounded-lg border border-amber-300 hover:shadow-md transition cursor-pointer"
                  onClick={() => handleVerDetalle(solicitud.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {solicitud.titulo}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Solicitante: <strong>{solicitud.solicitante?.nombre || 'N/A'}</strong>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(solicitud.fecha_creacion).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      className="ml-4 flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition whitespace-nowrap"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerDetalle(solicitud.id);
                      }}
                    >
                      <Eye size={18} />
                      Revisar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={handleCrearSolicitud}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Nueva Solicitud
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {['todas', 'pendiente', 'aprobada', 'rechazada'].map((estado) => (
            <button
              key={estado}
              onClick={() => setFilter(estado)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === estado
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </button>
          ))}
        </div>

        {/* Solicitudes Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gray-50 border-b px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">📋 Todas mis solicitudes</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-600">
              Cargando solicitudes...
            </div>
          ) : solicitudesFiltradas.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              No hay solicitudes para mostrar
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Solicitante
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Responsable
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {solicitudesFiltradas.map((solicitud) => (
                  <tr key={solicitud.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {solicitud.titulo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {solicitud.solicitante?.nombre || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {solicitud.responsable?.nombre || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge status={solicitud.estado} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(solicitud.fecha_creacion).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleVerDetalle(solicitud.id)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                      >
                        <Eye size={18} />
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}