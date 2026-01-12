-- Usuarios
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(160) UNIQUE NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  rol VARCHAR(40) NOT NULL, -- solicitante, responsable, admin
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Solicitudes
CREATE TABLE solicitudes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(160) NOT NULL,
  descripcion TEXT NOT NULL,
  solicitante_id UUID NOT NULL REFERENCES usuarios(id),
  responsable_id UUID NOT NULL REFERENCES usuarios(id),
  tipo VARCHAR(60) NOT NULL, -- despliegue, acceso, cambio_tecnico, etc.
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente', -- pendiente, aprobado, rechazado
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Historial
CREATE TABLE historial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitud_id UUID NOT NULL REFERENCES solicitudes(id),
  usuario_id UUID NOT NULL REFERENCES usuarios(id),
  accion VARCHAR(20) NOT NULL, -- crear, aprobar, rechazar, comentar
  comentario TEXT,
  fecha TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_solicitudes_responsable ON solicitudes(responsable_id);
CREATE INDEX idx_historial_solicitud ON historial(solicitud_id);