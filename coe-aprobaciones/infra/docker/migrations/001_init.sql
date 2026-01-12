-- Usuarios
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(160) UNIQUE NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  rol VARCHAR(40) NOT NULL, -- solicitante, responsable, admin
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tipos de Solicitudes
CREATE TABLE tipos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(60) NOT NULL UNIQUE,
  descripcion TEXT,
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Solicitudes
CREATE TABLE solicitudes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(160) NOT NULL,
  descripcion TEXT NOT NULL,
  solicitante_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  responsable_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo UUID NOT NULL REFERENCES tipos(id) ON DELETE CASCADE,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente', -- pendiente, aprobada, rechazada
  motivo_rechazo TEXT,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
  fecha_aprobacion TIMESTAMP,
  fecha_rechazo TIMESTAMP
);

-- Historial de cambios
CREATE TABLE historial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitud_id UUID NOT NULL REFERENCES solicitudes(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  accion VARCHAR(50) NOT NULL, -- crear, aprobar, rechazar, comentar
  comentario TEXT,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Comentarios
CREATE TABLE comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitud_id UUID NOT NULL REFERENCES solicitudes(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  contenido TEXT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Notificaciones
CREATE TABLE notificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  solicitud_id UUID REFERENCES solicitudes(id) ON DELETE CASCADE,
  asunto VARCHAR(160) NOT NULL,
  cuerpo TEXT NOT NULL,
  fecha_envio TIMESTAMP NOT NULL DEFAULT NOW(),
  leida BOOLEAN DEFAULT FALSE
);

-- Índices para optimizar queries
CREATE INDEX idx_solicitudes_solicitante ON solicitudes(solicitante_id);
CREATE INDEX idx_solicitudes_responsable ON solicitudes(responsable_id);
CREATE INDEX idx_solicitudes_tipo ON solicitudes(tipo);
CREATE INDEX idx_solicitudes_estado ON solicitudes(estado);
CREATE INDEX idx_historial_solicitud ON historial(solicitud_id);
CREATE INDEX idx_historial_usuario ON historial(usuario_id);
CREATE INDEX idx_comentarios_solicitud ON comentarios(solicitud_id);
CREATE INDEX idx_comentarios_usuario ON comentarios(usuario_id);
CREATE INDEX idx_notificaciones_usuario ON notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_solicitud ON notificaciones(solicitud_id);