export const Badge = ({ estado }) => {
  const colores = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    aprobada: 'bg-green-100 text-green-800',
    rechazada: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colores[estado] || 'bg-gray-100'}`}>
      {estado.charAt(0).toUpperCase() + estado.slice(1)}
    </span>
  );
};