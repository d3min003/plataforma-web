# 🌐 CRM Web Inmobiliario (Frontend-only, listo para backend externo)

Plataforma CRM para gestión inmobiliaria sin backend. Todos los datos se almacenan en el navegador (localStorage). Ideal para demo, prototipos o uso personal sin servidor.

## 🚀 Demo
- Producción (Vercel): https://plataforma-web-gules.vercel.app/
- Código fuente (GitHub): https://github.com/d3min003/plataforma-web

## 🔑 Funciones principales
- Dashboard: métricas básicas + Pipeline Kanban con drag & drop para cambiar estado de propiedades.
- Clientes: registro, edición, segmentación (presupuesto, zona, tipo).
- Propiedades: alta/edición, estado (disponible/negociación/reservado/vendido).
- Acceso: solo login con usuario/contraseña provistos (hash + salt en localStorage).
- Asesores: alta y listado (con borrado) de usuarios no-admin.
- Cerrar sesión: sale de la cuenta y vuelve al login (módulo Configuración eliminado).

## 🛠️ Tecnologías
- Frontend: HTML, CSS, JavaScript
- Hosting: Vercel

## ▶️ Uso (sin localhost)
- Producción: usa la URL de Vercel indicada arriba.
- Sin servidor local: abre `index.html` directamente en tu navegador si necesitas probar offline.

### Acceso y cuentas
- Cuentas preconfiguradas (demo):
	- admin / Admin@123 (rol: admin)
	- asesor1 / Asesor@123 (rol: asesor)
	Las contraseñas se almacenan como hash+salt en localStorage (no es seguridad de producción).
	No hay auto-registro. Importación de usuarios deshabilitada.

## 📦 Estructura
```
.
├─ index.html
├─ /assets
│  ├─ /css
│  │  └─ styles.css
│  └─ /js
│     ├─ app.js             # bootstrap y registro de rutas
│     ├─ /core              # núcleo (router + storage)
│     │  ├─ router.js       # enrutador por hash
│     │  ├─ storage.js      # wrapper de localStorage + sesión + hash
│     │  └─ api.js          # capa API (list/get/create/update/remove) sobre storage
│     └─ /features          # módulos por funcionalidad
│        ├─ index.js        # barrel de exports
│        ├─ auth.js         # login
│        ├─ dashboard.js    # métricas + Kanban (Pipeline integrado)
│        ├─ clientes.js     # CRUD clientes
│        ├─ propiedades.js  # CRUD propiedades
│        ├─ asesores.js     # alta/listado/borrado de asesores
│        └─ (logout)        # acción de cerrar sesión (sin módulo Config)
```

## 🗺️ Roadmap (MVP)
- [x] CRUD clientes (localStorage)
- [x] CRUD propiedades + estados
- [x] Tablero Kanban con drag & drop
- [x] Listado de asesores (seed)
- [x] Exportar JSON (importar deshabilitado)
- [ ] Filtros avanzados y búsqueda
- [x] Métricas básicas (dashboard)
- [ ] PWA (offline + installable)

# Idiomas disponibles
- Español

## 🔌 Capa API y conexión a base de datos
- Capa API: `assets/js/core/api.js` abstrae el acceso a datos con fallback local.
	- Hoy usa localStorage internamente y puede sincronizar opcionalmente con un backend REST.
	- Métodos expuestos: `api.clients.list/get/create/update/remove` (y placeholders para `properties`, `users`).
	- Ya está integrada en Clientes.

### Activar sincronización con backend (opcional)
Para apuntar a un backend (por ejemplo, FastAPI del repo "base-datos-central"), defina una variable global antes de cargar la app:

```html
<!-- En index.html, antes de cargar assets/js/app.js -->
<script>window.CRM_API_BASE = "https://tu-backend:8080";</script>
```

Con esto, `api.js` hará GET/POST/PUT/DELETE contra `/clientes` (y similares), manteniendo la escritura/lectura local como respaldo si hay fallos de red. En altas, se usa un id temporal local y se reemplaza por el id definitivo si el backend lo devuelve.

### ¿Cómo conectarlo a una BD real?
Puedes activar la sincronización anterior o sustituir internamente las funciones de `api.js` por llamadas HTTP/SDK a tu backend/servicio, manteniendo las mismas firmas para no tocar las vistas.

- Opción 1: Supabase (Postgres)
	- Crea proyecto y tablas (users, clients, properties).
	- Activa RLS y define políticas.
	- Instala e inicializa supabase-js; en `api.js` usa `supabase.from('clients')...` en list/get/create/update/remove.

- Opción 2: Firebase Firestore
	- Crea proyecto y app web; copia la config.
	- En `api.js` usa colecciones (`clients`, `properties`, `users`) con el SDK.
	- Define reglas de seguridad y (opcional) reemplaza el login demo por Firebase Auth.

- Opción 3: Backend propio (REST/GraphQL)
	- Expón endpoints para clients/properties/users.
	- En `api.js` usa `fetch`/`axios` a tu API; maneja auth (JWT) y errores.

Nota: No expongas claves en el cliente en producción. Usa variables de entorno y, si es necesario, una capa serverless para operaciones sensibles.
