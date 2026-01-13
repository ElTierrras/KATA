import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

export default function Toast({ message, type = 'info', duration = 4000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle size={24} className="text-green-600" />,
      title: 'Éxito'
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: <XCircle size={24} className="text-red-600" />,
      title: 'Error'
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-800',
      icon: <AlertCircle size={24} className="text-amber-600" />,
      title: 'Advertencia'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: <Info size={24} className="text-blue-600" />,
      title: 'Información'
    }
  };

  const style = styles[type] || styles.info;

  return (
    <div className={`fixed bottom-4 right-4 ${style.bg} border rounded-lg p-4 shadow-lg flex items-start gap-3 max-w-sm z-50 animate-in slide-in-from-right-4 fade-in`}>
      <div className="flex-shrink-0">
        {style.icon}
      </div>
      <div className="flex-1">
        <p className={`font-semibold ${style.text}`}>{style.title}</p>
        <p className={`text-sm ${style.text} mt-1`}>{message}</p>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className={`flex-shrink-0 ${style.text} hover:opacity-70 transition`}
      >
        ✕
      </button>
    </div>
  );
}
