# 🌐 CRM Web Inmobiliario (Frontend-only, listo para backend externo)

Plataforma CRM para gestión inmobiliaria sin backend. Todos los datos se almacenan en el navegador (localStorage). Sin login ni API; ideal para demo, prototipos o uso personal sin servidor.

## 🚀 Demo
- Producción (Vercel): https://plataforma-web-gules.vercel.app/
- Código fuente (GitHub): https://github.com/d3min003/plataforma-web

## 🔑 Funciones principales
- Dashboard: métricas básicas + Pipeline Kanban con drag & drop para cambiar estado de propiedades.
- Clientes: registro, edición, segmentación (presupuesto, zona, tipo).
- Propiedades: alta/edición, estado (disponible/negociación/reservado/vendido).
- Asesores: alta y listado (con borrado) de usuarios.

## 🛠️ Tecnologías
- Frontend: HTML, CSS, JavaScript (SPA con enrutador por hash)
- Persistencia local: localStorage (sin backend)
- PWA: manifest + service worker (offline básico e instalable)
- Hosting: Vercel


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
```

## 🗺️ Roadmap (MVP)
- [x] CRUD clientes (localStorage)
- [x] CRUD propiedades + estados
- [x] Tablero Kanban con drag & drop
- [x] Listado de asesores (seed)
- [x] Filtros avanzados y búsqueda
- [x] Métricas básicas (dashboard)



# Idiomas disponibles
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

