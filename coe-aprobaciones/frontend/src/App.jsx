import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DetalleSolicitud from './pages/DetalleSolicitud.jsx';
import CrearSolicitud from './pages/CrearSolicitud.jsx';
import Notificaciones from './pages/Notificaciones.jsx';
import ToastContainer from './components/ToastContainer.jsx';

export default function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/solicitudes/:id" element={<DetalleSolicitud />} />
        <Route path="/crear-solicitud" element={<CrearSolicitud />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        {/* Redirigir a login por defecto */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}