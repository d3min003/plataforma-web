# Especificación técnica para IA: Base de datos y API del CRM Inmobiliario

Propósito: Este documento describe, de forma precisa y ejecutable, el modelo de datos, endpoints de API, reglas de negocio y la integración con la SPA existente para que una IA (o equipo backend) pueda implementar la base de datos y exponer un API compatible. La SPA actual es 100% frontend y usa localStorage; se provee una capa API que abstrae el acceso a datos para facilitar la migración.

## 1. Contexto y alcance
- Proyecto: SPA CRM Inmobiliario (HTML/CSS/JS, sin backend actual).
- Persistencia actual: localStorage namespace `crmInmo_v1`.
- Autenticación actual: login local con hash+salt (no seguro para producción).
- Módulos UI: Login, Dashboard (KPIs + Pipeline Kanban), Clientes (formulario extendido), Propiedades (formulario expandido), Asesores (alta/listado), Cerrar sesión.
- Capa API en frontend: `assets/js/core/api.js` (ya integrada en Clientes). Objetivo: sustituir su implementación local por una API remota sin cambiar las vistas.

## 2. Arquitectura y contrato en el frontend
- Router hash, rutas: `#/login`, `#/dashboard`, `#/clientes`, `#/propiedades`, `#/asesores`.
- Capa API (frontend): archivo `assets/js/core/api.js` expone métodos síncronos actualmente sobre localStorage. Para backend real, deben ser asíncronos (promesas) y mantener el contrato:
  - `api.clients.list(): Promise<Client[]>`
  - `api.clients.get(id): Promise<Client|null>`
  - `api.clients.create(data: ClientInput): Promise<Client>`
  - `api.clients.update(id, patch: Partial<Client>): Promise<Client>`
  - `api.clients.remove(id): Promise<boolean>`
  - Placeholders similares para `api.properties` y `api.users`.
- Requisito: Mantener las firmas y nombres para no tocar las vistas. Si se vuelven asíncronas, adaptar llamadas en vistas a `await` (sugerido en una segunda fase controlada).

## 3. Modelo de datos (relacional recomendado)

### 3.1. users
- id (uuid, pk)
- name (text, requerido)
- email (text, requerido, único)
- username (text, requerido, único)
- role (enum: 'admin'|'asesor', requerido)
- password_hash (text, requerido) // bcrypt/argon2
- created_at (timestamptz, default now)
- updated_at (timestamptz)

Índices:
- unique(email), unique(username)

Reglas:
- Solo 'admin' puede crear/borrar usuarios.
- No permitir borrar el último admin.

### 3.2. clients
- id (uuid, pk)
- name (text, requerido)
- email (text)
- phone_mobile (text)
- phone_alt (text)
- client_type (enum: 'Comprador'|'Vendedor'|'Arrendador'|'Arrendatario')
- contact_preferred (enum: 'Teléfono'|'WhatsApp'|'Correo'|'Otro')
- contact_source (enum: 'Página web'|'Redes sociales'|'Referencia'|'Otro')
- type_wanted (enum: 'Casa'|'Departamento'|'Oficina'|'Local'|'Terreno')
- zone (text)
- price_min (numeric)
- price_max (numeric)
- desired_features (text)
- offer_property_type (enum: 'Casa'|'Departamento'|'Oficina'|'Local'|'Terreno')
- offer_address (text)
- offer_price_estimate (numeric)
- advisor_assigned_id (uuid, fk -> users.id, null permitido)
- status (enum: 'Nuevo'|'En contacto'|'En negociación'|'Cerrado'|'Perdido', default 'Nuevo')
- notes (text)
- created_at (timestamptz, default now)
- updated_at (timestamptz)

Índices:
- idx_clients_status, idx_clients_advisor

### 3.3. properties
- id (uuid, pk)
- title (text, requerido)
- type (enum: 'Casa'|'Departamento'|'Terreno'|'Oficina'|'Local')
- address (text)
- neighborhood (text)
- city (text)
- state (text)
- postal_code (text)
- bedrooms (int)
- baths (int)
- built_m2 (numeric)
- land_m2 (numeric)
- parking (int)
- age_years (int)
- price (numeric)
- currency (enum: 'MXN'|'USD'|'Otro')
- operation (enum: 'Venta'|'Renta')
- legal_status (enum: 'Libre'|'Hipotecada'|'En trámite')
- owner_name (text)
- contact_info (text)
- status (enum: 'disponible'|'negociacion'|'reservado'|'vendido', default 'disponible')
- created_at (timestamptz, default now)
- updated_at (timestamptz)

Índices:
- idx_properties_status

Notas:
- El campo "Descripción" fue eliminado del formulario de propiedades; no incluirlo en el esquema.

## 4. Reglas de negocio clave
- Autenticación: login con usuario o email + contraseña. En producción, usar JWT (expedición/validación en backend) y hashing fuerte (bcrypt/argon2).
- Autorización:
  - admin: CRUD de users, clients, properties.
  - asesor: CRUD de clients, properties. (Opcional: limitar a asignados.)
- Pipeline: estados fijos de propiedades: disponible → negociacion → reservado → vendido (cíclico por acción “Mover” o drag & drop).
- Clientes: formulario extendido; status por defecto 'Nuevo'.
- Asesores: alta desde UI (admin) crea usuario con rol 'asesor'.

## 5. API REST propuesta
Base URL: `${API_BASE_URL}`

Autenticación:
- POST /auth/login
  - Body: { identifier: string (username o email), password: string }
  - 200: { token: string, user: { id, name, email, username, role } }
  - Set `Authorization: Bearer <token>` en siguientes llamadas.

Usuarios (admin):
- GET /users
- POST /users { name, email, username, role, password }
- DELETE /users/:id

Clientes:
- GET /clients?status=...&advisorId=...&q=...&limit=&offset=
- GET /clients/:id
- POST /clients { ...ClientInput }
- PUT /clients/:id { ...Partial<Client> }
- DELETE /clients/:id

Propiedades:
- GET /properties?status=...&q=...&limit=&offset=
- GET /properties/:id
- POST /properties { ...PropertyInput }
- PUT /properties/:id { ...Partial<Property> }
- DELETE /properties/:id

Ejemplos (esquemáticos):
```
POST /clients
{
  "name": "Juan Pérez",
  "email": "juan@mail.com",
  "phoneMobile": "+52...",
  "clientType": "Comprador",
  "contactPreferred": "WhatsApp",
  "typeWanted": "Casa",
  "zone": "Roma Norte",
  "priceMin": 2000000,
  "priceMax": 3500000,
  "status": "Nuevo"
}
```

Errores (estándar):
- 400 ValidationError { field, message }
- 401 Unauthorized
- 403 Forbidden
- 404 NotFound
- 409 Conflict (email/username duplicados)
- 500 ServerError

## 6. Seguridad
- Hash de contraseñas: bcrypt/argon2.
- JWT firmado (HS256/RS256) con expiración; refresh tokens opcional.
- CORS: orígenes permitidos del despliegue.
- Rate limiting y protección contra enumeración de usuarios.
- RLS/ACL en BD si aplica (ej. Supabase RLS; Firestore Rules).

## 7. Variables de entorno (cliente y servidor)
- Cliente (build-time): VITE_API_BASE_URL o similar.
- Servidor: DB_URL, JWT_SECRET o claves, SMTP si se usa email, etc.

## 8. Plan de migración desde localStorage
1) Implementar el API con endpoints anteriores.
2) Sustituir implementación de `assets/js/core/api.js` para llamar al backend (mantener firmas). Volver métodos a async.
3) Adaptar vistas a `await` en puntos de acceso a API (Clientes ya es el candidato principal; migrar Propiedades/Usuarios).
4) Añadir manejo de sesión real: guardar token en memoria/Storage seguro y enviar Authorization.
5) Proveer scripts de importación inicial desde export JSON (si aplica).

## 9. Semillas iniciales (servidor)
- Crear dos usuarios si no existen:
  - admin / admin@example.com (rol: admin) con contraseña segura.
  - asesor1 / asesor1@example.com (rol: asesor).
- No retornar contraseñas; solo hash en BD.

## 10. Testing rápido (smoke)
- POST /auth/login → 200 con token.
- CRUD básico de /clients y /properties con token válido.
- RBAC: usuario asesor no puede crear/borrar usuarios; admin sí.

## 11. Consideraciones adicionales
- Paginación, ordenamiento, y filtros en listados.
- Campos numéricos con precisión adecuada (price_* y price con numeric/decimal).
- Auditoría mínima: created_at/updated_at en todas las tablas.
- Internacionalización: valores enum según catálogo mostrado en UI.

## 12. Trazabilidad con la UI actual
- Dashboard integra KPIs + Kanban; el backend no requiere endpoint específico de tablero (la UI calcula estados), aunque puede proveer uno opcional `/metrics`.
- Asesores: alta desde UI crea usuario rol 'asesor'. Admin-only.
- Config fue removido; cierre de sesión limpia token/sesión.

---
Entrega: Implementar BD y API conforme a este contrato, y reemplazar la implementación de `api.js` por llamadas al backend manteniendo las firmas. Cualquier extensión debe ser compatible con la UI o entregada con cambios coordinados en el frontend.
