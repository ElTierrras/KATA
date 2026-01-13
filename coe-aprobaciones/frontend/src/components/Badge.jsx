export default function Badge({ status }) {
  const estadoConfig = {
    pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    aprobada: { bg: 'bg-green-100', text: 'text-green-800' },
    rechazada: { bg: 'bg-red-100', text: 'text-red-800' },
  };

  const config = estadoConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}