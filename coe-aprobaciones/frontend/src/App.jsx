import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { CrearSolicitud } from './pages/CrearSolicitud';
import { DetalleSolicitud } from './pages/DetalleSolicitud';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/crear-solicitud" element={<CrearSolicitud />} />
        <Route path="/solicitud/:id" element={<DetalleSolicitud />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;