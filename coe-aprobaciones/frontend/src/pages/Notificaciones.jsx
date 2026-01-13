import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { getBandejaUsuario } from '../services/notificacionService';

const Notificaciones = () => {
  const { user } = useAuthStore();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const datos = await getBandejaUsuario(user?.id);
        setNotificaciones(datos || []);
      } catch (err) {
        console.error('Error cargando notificaciones:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) cargar();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Bandeja de Notificaciones</h1>
          <p className="text-sm text-gray-600">Listado completo de notificaciones</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : notificaciones.length === 0 ? (
          <div className="p-8 bg-white rounded-lg shadow text-center text-gray-500">No hay notificaciones</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul>
              {notificaciones.map((n) => (
                <li key={n.id} className="p-4 border-b hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{n.asunto}</div>
                      <div className="text-sm text-gray-600 mt-1">{n.cuerpo}</div>
                      <div className="text-xs text-gray-400 mt-2">{new Date(n.fecha_envio).toLocaleString()}</div>
                    </div>
                    <div className="ml-4">
                      {!n.leida ? <span className="inline-block text-xs bg-red-100 text-red-700 px-2 py-1 rounded">No leída</span> : <span className="text-xs text-gray-500">Leída</span>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default Notificaciones;
