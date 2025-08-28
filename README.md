# 🌐 CRM Web Inmobiliario (Frontend con opción de backend ligero)

Plataforma CRM para gestión inmobiliaria que funciona 100% en el navegador (localStorage) y ahora incluye:
- Login local opcional (sin servidor) para proteger el acceso.
- Backend ligero opcional (Express + PostgreSQL + JWT) en la carpeta `backend/`, pensado como puente entre Vercel (solo frontend) y una base de datos central en un servidor físico.

## 🚀 Demo
- Producción (Vercel): https://plataforma-web-gules.vercel.app/

## key-user
- user : Corporativo_Diamante
- password : CD2025/3$$

## 🔑 Funciones principales
- Dashboard: métricas básicas + Pipeline Kanban con drag & drop para cambiar estado de propiedades.
- Clientes: registro, edición, segmentación (presupuesto, zona, tipo).
- Propiedades: alta/edición, estado (disponible/negociación/reservado/vendido).
- Asesores: alta y listado (con borrado) de usuarios.

## 🛠️ Tecnologías
- Frontend: HTML, CSS, JavaScript (SPA con enrutador por hash)
- Persistencia local: localStorage (sin backend por defecto)
- PWA: manifest + service worker (offline básico e instalable)
- Hosting: Vercel
- Backend opcional: Node.js (Express), PostgreSQL, JWT, Helmet, CORS, Rate limiting, Zod


## 📦 Estructura
```
.
├─ index.html
├─ manifest.webmanifest
├─ sw.js
├─ /assets
│  ├─ /css
│  │  └─ styles.css
│  └─ /js
│     ├─ app.js             # bootstrap y registro de rutas
│     ├─ /core              # núcleo (router + storage)
│     │  ├─ router.js       # enrutador por hash
│     │  ├─ storage.js      # wrapper de localStorage + sesión + hash
│     └─ /features          # módulos por funcionalidad
│        ├─ index.js        # barrel de exports
│        ├─ dashboard.js    # métricas + Kanban (Pipeline integrado)
│        ├─ clientes.js     # CRUD clientes
│        ├─ propiedades.js  # CRUD propiedades
│        ├─ asesores.js     # alta/listado/borrado de asesores
│        └─ views.js        # shim de compatibilidad para imports legacy
 └─ /backend                 # backend ligero (opcional)
	 ├─ package.json
	 ├─ .env.example          # variables de entorno
	 ├─ /src
	 │  ├─ server.js          # servidor Express
	 │  ├─ /db/pool.js        # pool PostgreSQL
	 │  ├─ /auth/jwt.js       # firmado/verificación JWT
	 │  ├─ /middlewares/auth.js
	 │  ├─ /routes            # auth, user, customers, notes
	 │  └─ /scripts/seedAdmin.js
	 └─ /sql/schema.sql       # esquema mínimo (users, customers, notes)
```

## 🗺️ Roadmap (MVP)
- [x] CRUD clientes (localStorage)
- [x] CRUD propiedades + estados
- [x] Tablero Kanban con drag & drop
- [x] Listado de asesores (seed)
- [x] Dashboard Clientes: filtros avanzados y búsqueda
- [x] Dashboard Propiedades: filtros avanzados y búsqueda
- [x] Dashboard Asesores: filtros y búsqueda
- [x] Métricas básicas (dashboard)



## Idiomas disponibles
- Español


## 🔗 Integración opcional con backend "base-datos-central"
- Soportado para Clientes mediante API-key y multi-tenant por cabeceras.
- Offline-first: si no configuras conexión, la app funciona 100% local.

Cómo configurar (opción rápida en index.html, antes de cargar app.js):

```html
<script>
	window.CRM_API_BASE = 'http://localhost:3000'; // URL del backend
	window.CRM_API_KEY  = '...';                   // API key (admin o crm_service)
	window.CRM_ORG_ID   = '...';                   // UUID de la organización
	// También puedes guardar estos valores en localStorage con claves:
	// crm.api.base, crm.api.key, crm.api.org
	// La capa API los tomará automáticamente.
	// Módulo: assets/js/core/api.js
	// Uso actual: creación/edición de Clientes hace upsert en remoto sin bloquear la UI.
	// Endpoints usados: POST /clients, POST /batch/clients/import
	// Próximos: /interactions, /sales
	// Nota: Propiedades siguen locales hasta que exista endpoint en el backend.
</script>
```

Notas
- La sincronización remota es best-effort: si falla la red o credenciales, no rompe la UI ni bloquea acciones.
- Se almacena el ID remoto (remoteId) cuando está disponible para facilitar reconciliación.

## 🔧 Backend ligero (opcional) para Vercel + servidor físico

Este repo incluye un backend Express para actuar como puente seguro entre el frontend en Vercel y una base de datos PostgreSQL en un servidor físico. No expone la BD al navegador y valida JWT en cada request.

Endpoints mínimos (todos bajo `/api`):
- POST `/auth/login` → { email, password } → { token }
- POST `/auth/logout` → stateless (el frontend borra el token)
- GET `/user/me` → usuario autenticado (Bearer)
- GET `/customers` → lista de clientes (Bearer)
- POST `/customers` → crear cliente (Bearer)
- GET `/notes?customerId=UUID` → notas (Bearer)
- POST `/notes` → crear nota { customerId, text } (Bearer)

JWT y seguridad:
- HS256 con `JWT_SECRET`, `JWT_ISSUER`, `JWT_AUDIENCE`, `JWT_EXPIRES_IN`.
- Middleware `requireAuth` (Authorization: Bearer <token>).
- Helmet, CORS (restringe con `CORS_ORIGIN`), rate limit y logs.

Conexión a PostgreSQL:
- Pool `pg` en `backend/src/db/pool.js`.
- Esquema básico en `backend/sql/schema.sql` (users, customers, notes).
- Script de semilla `npm run seed` para crear un admin inicial.

Cómo ejecutarlo (Windows PowerShell):

```powershell
cd .\backend
copy .env.example .env
# Edita .env: PGHOST/PGUSER/PGDATABASE/JWT_SECRET/CORS_ORIGIN/PORT
# Crea las tablas (ejecutar en el servidor con psql instalado):
# psql -h 127.0.0.1 -U crm_app -d crm -f .\sql\schema.sql
npm install
npm run seed
npm start
```

Despliegue y HTTPS:
- Ejecuta el backend en el mismo servidor que PostgreSQL.
- Termina TLS con Nginx/Traefik (reverse proxy) y proxyea a `http://127.0.0.1:8080`.
- No expongas PostgreSQL a Internet (solo localhost/red privada).

Sesiones multi-dispositivo (buenas prácticas):
- JWT stateless permite múltiples equipos sin conflicto.
- Para revocar sesiones: añade `token_version` en `users` y verifícala en `requireAuth`, o usa una blacklist corta en memoria/Redis.

## Repositorios GitHub

- Base de datos central (este proyecto): https://github.com/d3min003/base-datos-central
- Plataforma web (CRM): https://github.com/d3min003/plataforma-web
- Asesor AI : https://github.com/d3min003/asesor-digital