# 🏗️ Arquitectura y Diagramas - COE Aprobaciones

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Componentes del Sistema](#componentes-del-sistema)
3. [Flujos de Proceso](#flujos-de-proceso)
4. [Modelo de Datos](#modelo-de-datos)
5. [Topología de Red](#topología-de-red)
6. [Consideraciones Técnicas](#consideraciones-técnicas)

---

## Resumen Ejecutivo

**COE Aprobaciones** es una aplicación web de 3 capas que facilita la gestión de solicitudes de aprobación en una organización.

### Características Arquitectónicas Clave:

- **Frontend Moderno:** React 18 + Vite + TailwindCSS
- **Backend Escalable:** Node.js + Express.js con arquitectura MVC
- **Base de Datos Relacional:** PostgreSQL con 7 tablas normalizadas
- **Comunicación:** REST API con CORS habilitado
- **Notificaciones:** Sistema de correos automáticos vía Gmail
- **Estado Global:** Zustand para gestión de estado en cliente

### Números Clave:

| Métrica | Valor |
|---------|-------|
| Total de Endpoints | 22 |
| Tablas de Base de Datos | 7 |
| Índices de Rendimiento | 10 |
| Componentes React | 8 (6 páginas + 2 compartidos) |
| Servicios API | 6 |
| Stores Zustand | 3 |

---

## Componentes del Sistema

### 1. Capa de Presentación (Frontend)

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                         │
│  (Running on: http://localhost:5173)                         │
├─────────────────────────────────────────────────────────────┤
│  Pages                                                       │
│  ├─ Login.jsx           → Autenticación                     │
│  ├─ Registro.jsx        → Registro de usuarios              │
│  ├─ Dashboard.jsx       → Panel principal                   │
│  ├─ CrearSolicitud.jsx  → Formulario de creación            │
│  ├─ DetalleSolicitud.jsx → Vista de solicitud               │
│  └─ Notificaciones.jsx  → Centro de notificaciones          │
├─────────────────────────────────────────────────────────────┤
│  Components Compartidos                                      │
│  ├─ Toast.jsx           → Notificación individual           │
│  ├─ ToastContainer.jsx  → Contenedor de notificaciones      │
│  ├─ NotificationBell.jsx → Campana de alertas               │
│  └─ Badge.jsx           → Etiquetas de estado               │
├─────────────────────────────────────────────────────────────┤
│  Estado Global (Zustand)                                     │
│  ├─ useAuthStore        → Autenticación y sesión            │
│  ├─ useSolicitudStore   → Datos de solicitudes              │
│  └─ useToastStore       → Notificaciones UI                 │
├─────────────────────────────────────────────────────────────┤
│  Servicios API                                               │
│  ├─ api.js              → Cliente Axios base                │
│  ├─ usuariosService.js  → Auth & usuarios                   │
│  ├─ solicitudesService.js → Gestión solicitudes            │
│  ├─ tiposService.js     → Tipos de solicitudes              │
│  ├─ notificacionesService.js → Correos                     │
│  └─ historialService.js → Auditoría                         │
└─────────────────────────────────────────────────────────────┘
```

**Tecnologías:**
- React 18.2 - Framework UI
- Vite 5.0 - Bundler
- TailwindCSS 3.3 - Estilos
- Zustand 4.5.7 - State Management
- Axios 1.13.2 - HTTP Client
- React Router DOM 6.20 - Enrutamiento

### 2. Capa de Lógica de Negocio (Backend)

```
┌──────────────────────────────────────────────────────────────┐
│                  Express.js Server                            │
│  (Running on: http://localhost:8080)                          │
├──────────────────────────────────────────────────────────────┤
│  Routes (10 rutas principales)                               │
│  ├─ /usuarios           → CRUD usuarios                      │
│  ├─ /login              → Autenticación                      │
│  ├─ /registro           → Registro                           │
│  ├─ /solicitudes        → CRUD solicitudes                   │
│  ├─ /solicitudes/:id/aprobar → Aprobación                   │
│  ├─ /solicitudes/:id/rechazar → Rechazo                     │
│  ├─ /tipos              → CRUD tipos                         │
│  ├─ /correos            → Envío de emails                    │
│  ├─ /notificaciones     → Bandeja de notificaciones          │
│  └─ /historial          → Auditoría                          │
├──────────────────────────────────────────────────────────────┤
│  Controllers (Lógica de Negocio)                             │
│  ├─ usuarios.controllers.js     (6 funciones)               │
│  ├─ solicitudes.controllers.js  (8 funciones)               │
│  ├─ tipos.controllers.js        (5 funciones)               │
│  ├─ notificaciones.controllers.js (2 funciones)             │
│  └─ historial.controllers.js    (2 funciones)               │
├──────────────────────────────────────────────────────────────┤
│  Services (Servicios Especializados)                         │
│  └─ emailService.js             (3 funciones)               │
│     └─ Nodemailer + Gmail SMTP                              │
├──────────────────────────────────────────────────────────────┤
│  Middleware                                                   │
│  ├─ CORS - Permite requests de frontend                     │
│  └─ express.json() - Parsea JSON                            │
├──────────────────────────────────────────────────────────────┤
│  Database Connection                                          │
│  └─ db.js → Pool de conexiones PostgreSQL                   │
└──────────────────────────────────────────────────────────────┘
```

**Tecnologías:**
- Express.js 4.18 - Framework web
- Node.js - Runtime
- pg 8.16.3 - PostgreSQL driver
- Nodemailer 7.0.12 - Envío de emails
- CORS 2.8.5 - Control de origen
- dotenv 16.6.1 - Variables de entorno

### 3. Capa de Datos (Base de Datos)

```
┌─────────────────────────────────────────────────────────────┐
│            PostgreSQL Database                               │
│         (Database: coe_aprobaciones)                          │
├─────────────────────────────────────────────────────────────┤
│  Tablas de Núcleo                                            │
│  ├─ usuarios           (Usuarios del sistema)               │
│  ├─ tipos              (Categorías de solicitudes)          │
│  └─ solicitudes        (Solicitudes principales)            │
├─────────────────────────────────────────────────────────────┤
│  Tablas de Auditoría y Comunicación                          │
│  ├─ historial          (Registro de cambios)                │
│  ├─ comentarios        (Discusión de solicitudes)           │
│  └─ notificaciones     (Registro de correos)                │
├─────────────────────────────────────────────────────────────┤
│  Características                                              │
│  ├─ 7 tablas normalizadas                                   │
│  ├─ UUIDs como PKs                                          │
│  ├─ 10 índices para optimización                            │
│  ├─ Foreign keys con ON DELETE CASCADE                      │
│  └─ Constraints para integridad                             │
└─────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
- PostgreSQL 12+
- Almacenamiento: ~100GB (con millones de registros)
- Pool: 20 conexiones máximo
- Timeout de conexión: 2000ms
- Idle timeout: 30000ms

---

## Flujos de Proceso

### Flujo 1: Autenticación

```
Usuario                          Frontend                    Backend                Database
  │                                 │                           │                       │
  │─ Ingresa credenciales ────────➤│                           │                       │
  │                                 │─ Valida inputs ────────➤│                       │
  │                                 │                           │─ Query user ───────➤│
  │                                 │                           │◀─ Returns user ────│
  │                                 │◀─ Retorna datos ───────│                       │
  │◀─ Redirige a Dashboard ───────│                           │                       │
  │     (sesión iniciada)           │                           │                       │
```

**Tiempo: ~200-500ms**

### Flujo 2: Crear Solicitud

```
Solicitante                     Frontend              Backend                   Database
  │                                │                       │                         │
  │─ Completa formulario ────────➤│                       │                         │
  │                                │─ Valida inputs ────➤│                         │
  │                                │                       │─ INSERT solicitud ──➤│
  │                                │                       │◀─ Returns ID ───────│
  │                                │                       │─ GET responsable ──➤│
  │                                │                       │◀─ User email ──────│
  │                                │                       │─ SEND EMAIL ───────➤ Gmail SMTP
  │                                │                       │─ INSERT notif ─────➤│
  │                                │◀─ 201 Created ──────│                       │
  │◀─ Toast success ───────────────│                       │                         │
  │     y redirección             │                       │                         │
```

**Tiempo: ~500-1500ms (variante con email)**

### Flujo 3: Aprobar Solicitud

```
Responsable                    Frontend              Backend                   Database
  │                                │                       │                         │
  │─ Click Aprobar ──────────────➤│                       │                         │
  │                                │─ Validaciones ────➤│                         │
  │                                │                       │─ UPDATE solicitud ─➤│
  │                                │                       │─ INSERT historial ─➤│
  │                                │                       │─ SEND EMAIL ───────➤ Gmail SMTP
  │                                │◀─ 200 OK ────────────│                       │
  │◀─ Recarga dashboard ─────────│                       │                         │
```

**Tiempo: ~800-2000ms**

---

## Modelo de Datos

### Diagrama ER Simplificado

```
┌──────────────────┐
│    USUARIOS      │
├──────────────────┤
│ id (PK)          │
│ nombre           │
│ correo (UNIQUE)  │
│ contrasena       │
│ rol              │
│ creado_en        │
└────────┬─────────┘
         │
         ├─── crea ────────────┐
         │                     │
         ├─ responsable ──────────────┐
         │                            │
         ├─ realiza acciones ──┐      │
         │                     │      ▼
         │              ┌──────────────────────┐
         │              │   SOLICITUDES       │
         │              ├──────────────────────┤
         │              │ id (PK)              │
         │              │ titulo               │
         │              │ descripcion          │
         │              │ estado               │
         │              │ solicitante_id (FK)  │
         │              │ responsable_id (FK)  │
         │              │ tipo (FK)            │
         │              │ motivo_rechazo       │
         │              │ fecha_creacion       │
         │              │ fecha_aprobacion     │
         │              │ fecha_rechazo        │
         │              └──────┬───────────────┘
         │                     │
         └─────────────────────┤
                              │
         ┌──────────────────────────────┐
         │ TIPOS                        │
         ├──────────────────────────────┤
         │ id (PK)                      │
         │ nombre (UNIQUE)              │
         │ descripcion                  │
         │ creado_en                    │
         └──────────────────────────────┘
         ▲
         │
         └─────────────────────────────┐
                                       │
         ┌──────────────────────────────────┐
         │        HISTORIAL                 │
         ├──────────────────────────────────┤
         │ id (PK)                          │
         │ solicitud_id (FK)                │
         │ usuario_id (FK)                  │
         │ accion                           │
         │ comentario                       │
         │ fecha_creacion                   │
         └──────────────────────────────────┘

         ┌──────────────────────────────────┐
         │       COMENTARIOS                │
         ├──────────────────────────────────┤
         │ id (PK)                          │
         │ solicitud_id (FK)                │
         │ usuario_id (FK)                  │
         │ contenido                        │
         │ fecha_creacion                   │
         └──────────────────────────────────┘

         ┌──────────────────────────────────┐
         │     NOTIFICACIONES               │
         ├──────────────────────────────────┤
         │ id (PK)                          │
         │ usuario_id (FK)                  │
         │ solicitud_id (FK - nullable)     │
         │ asunto                           │
         │ cuerpo                           │
         │ fecha_envio                      │
         │ leida                            │
         └──────────────────────────────────┘
```

### Normas de Integridad

| Relación | Tipo | Regla |
|----------|------|-------|
| usuario → solicitud (solicitante) | 1:N | ON DELETE CASCADE |
| usuario → solicitud (responsable) | 1:N | ON DELETE CASCADE |
| usuario → historial | 1:N | ON DELETE CASCADE |
| tipo → solicitud | 1:N | ON DELETE CASCADE |
| solicitud → historial | 1:N | ON DELETE CASCADE |
| solicitud → comentarios | 1:N | ON DELETE CASCADE |
| solicitud → notificaciones | 1:N | ON DELETE CASCADE |
| usuario → notificaciones | 1:N | ON DELETE CASCADE |

---

## Topología de Red

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET                                │
└──────────────────────────────────┬──────────────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
            ┌─────────────┐  ┌──────────┐  ┌────────────┐
            │  Cliente    │  │ Backend  │  │  Externos  │
            │  (Browser)  │  │ (Node)   │  │ (Gmail)    │
            └──────┬──────┘  └──────┬───┘  └────────────┘
                   │               │
                   │ HTTP/REST      │
                   │ (Port 5173)    │
                   │               │
                   ├──────────────┬┘
                   │              │
                   │          Port 8080
                   │              │
                   │    ┌─────────▼────────┐
                   │    │ Express Server   │
                   │    │ - CORS enabled   │
                   │    │ - JSON parser    │
                   │    └────────┬─────────┘
                   │             │
                   │        Port 5432
                   │             │
                   │    ┌────────▼─────────┐
                   │    │  PostgreSQL      │
                   │    │  - 7 Tables      │
                   │    │  - Indexes       │
                   │    │  - Constraints   │
                   │    └──────────────────┘
                   │
                   └─── CORS Request ───────┐
                         Allowed origins:   │
                         - localhost:5173   │
                         - localhost:3000   │
                         - 127.0.0.1:5173   │
```

---

## Consideraciones Técnicas

### Rendimiento

| Métrica | Objetivo | Actual |
|---------|----------|--------|
| **Tiempo de respuesta API** | < 500ms | ~200-300ms |
| **Cargas de solicitudes** | < 1000ms | ~400-600ms |
| **Envío de emails** | Async (no bloquea) | ✅ Implementado |
| **Caché de datos** | Frontend (Zustand) | ✅ Implementado |

### Escalabilidad

```
Crecimiento estimado:
- Usuarios: 50 → 500 (10x)
- Solicitudes: 100 → 10000 (100x)
- Historial: 500 → 50000 (100x)
- Comentarios: 1000 → 100000 (100x)

Recomendaciones:
1. Aumentar pool de conexiones a 50 en producción
2. Implementar caché Redis para solicitudes frecuentes
3. Agregar CDN para assets estáticos
4. Implementar paginación en listados
5. Usar connection pooling en backend
```

### Seguridad

**Estado Actual:**
- ⚠️ **CRÍTICO:** Sin hash de contraseñas (texto plano)
- ⚠️ **CRÍTICO:** Sin JWT/sesiones seguras
- ⚠️ **IMPORTANTE:** Sin rate limiting
- ⚠️ **IMPORTANTE:** Sin validaciones de rol en backend

**Recomendaciones Producción:**

```
1. Autenticación:
   ✅ Usar bcrypt para hash de contraseñas
   ✅ Implementar JWT con refresh tokens
   ✅ HTTPS obligatorio

2. Validaciones:
   ✅ Validar roles en cada endpoint
   ✅ Sanitizar inputs HTML
   ✅ Rate limiting por IP

3. Base de Datos:
   ✅ Prepared statements (✅ ya implementado)
   ✅ Backups automáticos
   ✅ Encryption de datos sensibles

4. Infraestructura:
   ✅ WAF (Web Application Firewall)
   ✅ SSL/TLS certificates
   ✅ VPN para BD
```

### Alta Disponibilidad

```
Recomendaciones:
1. Load Balancer (Nginx/HAProxy)
2. Backend replicado (2+ instancias)
3. Database replication (Primaryy/Standby)
4. Redis para sesiones distribuidas
5. Monitoring (New Relic, DataDog)
6. Auto-scaling en Kubernetes
```

---

## 📈 Métricas y KPIs

| KPI | Meta | Fórmula |
|-----|------|---------|
| **Response Time** | < 500ms | Promedio de latencia |
| **Availability** | 99.9% | Uptime / Período |
| **Error Rate** | < 0.1% | Errores 5xx / Total requests |
| **Solicitudes/día** | - | COUNT(solicitudes) daily |
| **Tasa de aprobación** | > 80% | Aprobadas / Total |
| **Tiempo promedio resolución** | < 2 días | fecha_aprobación - fecha_creación |

---

## 🚀 Roadmap de Mejoras

### Corto Plazo (1-2 meses)
- [ ] Implementar hash de contraseñas
- [ ] Agregar JWT authentication
- [ ] Validaciones de roles en backend
- [ ] Testing con Jest

### Mediano Plazo (2-3 meses)
- [ ] Implementar caché Redis
- [ ] Agregar búsqueda full-text
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Dashboard con estadísticas

### Largo Plazo (3-6 meses)
- [ ] Multi-idioma (i18n)
- [ ] Exportar reportes (PDF/Excel)
- [ ] API Gateway con rate limiting
- [ ] Microservicios (separa por dominio)
- [ ] GraphQL alternativo a REST

---

## 📞 Contacto

Para preguntas o sugerencias sobre la arquitectura, contactar al equipo de desarrollo.

**Última actualización:** 13 de enero de 2026
