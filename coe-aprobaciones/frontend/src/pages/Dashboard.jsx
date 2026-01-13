import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Eye } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';
import { useSolicitudStore } from '../store/useSolicitudStore.js';
import Badge from '../components/Badge.jsx';

export default function Dashboard() {
  const { usuario, logout } = useAuthStore();
  const { solicitudes, listarSolicitudes, loading, error } = useSolicitudStore();
  const [filter, setFilter] = useState('todas');
  const navigate = useNavigate();

  // Cargar solicitudes al montar el componente
  useEffect(() => {
    if (usuario) {
      console.log('📋 Cargando solicitudes del usuario:', usuario.id);
      listarSolicitudes();
    }
  }, [usuario, listarSolicitudes]);

  // Redirigir si no está autenticado
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

  // Filtrar solicitudes según el estado
  const solicitudesFiltradas = solicitudes.filter((solicitud) => {
    if (filter === 'todas') return true;
    return solicitud.estado === filter;
  });

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
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Monto
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
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {solicitud.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {solicitud.tipo_solicitud}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge status={solicitud.estado} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${solicitud.monto?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
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