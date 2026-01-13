import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { CrearSolicitud } from './pages/CrearSolicitud';
import { DetalleSolicitud } from './pages/DetalleSolicitud';
import Notificaciones from './pages/Notificaciones';
import Login from './pages/Login';
import Registro from './pages/Registro';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/crear-solicitud" element={<CrearSolicitud />} />
        <Route path="/solicitud/:id" element={<DetalleSolicitud />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;