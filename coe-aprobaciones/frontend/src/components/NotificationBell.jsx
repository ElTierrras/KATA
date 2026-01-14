import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { getBandejaUsuario } from '../services/notificacionService';

export const NotificationBell = ({ usuarioId }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarPanel, setMostrarPanel] = useState(false);

  useEffect(() => {
    const cargarNotificaciones = async () => {
      try {
        const datos = await getBandejaUsuario(usuarioId);
        setNotificaciones(datos);
      } catch (error) {
        console.error('Error cargando notificaciones:', error);
      }
    };

    cargarNotificaciones();
    
    const intervalo = setInterval(cargarNotificaciones, 30000);
    return () => clearInterval(intervalo);
  }, [usuarioId]);

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <div className="relative">
      <button
        onClick={() => setMostrarPanel(!mostrarPanel)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full"
      >
        <Bell size={24} />
        {noLeidas > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {noLeidas}
          </span>
        )}
      </button>

      {mostrarPanel && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b font-semibold">Notificaciones</div>
          <div className="max-h-96 overflow-y-auto">
            {notificaciones.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Sin notificaciones</div>
            ) : (
              notificaciones.map((notif) => (
                <div key={notif.id} className="p-3 border-b hover:bg-gray-50">
                  <div className="font-semibold text-sm">{notif.asunto}</div>
                  <div className="text-xs text-gray-600 mt-1">{notif.cuerpo}</div>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(notif.fecha_envio).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};