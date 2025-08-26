# 🌐 CRM Web Inmobiliario (Frontend-only)

Plataforma CRM para gestión inmobiliaria sin backend. Todos los datos se almacenan en el navegador (localStorage). Ideal para demo, prototipos o uso personal sin servidor.

## 🚀 Demo
- Producción (Vercel): https://plataforma-web-gules.vercel.app/
- Código fuente (GitHub): https://github.com/d3min003/plataforma-web

## 🔑 Funciones principales
- Clientes: registro, edición, segmentación (presupuesto, zona, tipo).
- Propiedades: alta/edición, estado (disponible/negociación/reservado/vendido).
- Pipeline: tablero Kanban con drag & drop para cambiar estado.
- Acceso: solo login con usuario/contraseña provistos (hash + salt en localStorage).
- Asesores: listado básico de usuarios no-admin.
- Configuración: exportar JSON y reset local (importar deshabilitado).

## 🛠️ Tecnologías
- Frontend: HTML, CSS, JavaScript
- Hosting: Vercel

## ▶️ Uso (sin localhost)
- Producción: usa la URL de Vercel indicada arriba.
- Sin servidor local: abre `index.html` directamente en tu navegador si necesitas probar offline.

### Acceso y cuentas
- Cuentas preconfiguradas (demo):
	- admin / Admin1234 (rol: admin)
	- asesor1 / Asesor1234 (rol: asesor)
	Puedes ingresar con usuario o email. Las contraseñas se almacenan como hash+salt en localStorage (no es seguridad de producción).
	Importación de usuarios deshabilitada. No hay auto-registro.

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
│        ├─ dashboard.js    # métricas
│        ├─ clientes.js     # CRUD clientes
│        ├─ propiedades.js  # CRUD propiedades
│        ├─ pipeline.js     # Kanban DnD
│        ├─ asesores.js     # listado asesores
│        └─ config.js       # export/reset
```

## 🗺️ Roadmap (MVP)
- [x] CRUD clientes (localStorage)
- [x] CRUD propiedades + estados
- [x] Tablero Kanban con drag & drop
- [x] Listado de asesores (seed)
- [x] Exportar JSON (importar deshabilitado)
- [ ] Filtros avanzados y búsqueda
- [ ] Métricas básicas (dashboard)
- [ ] PWA (offline + installable)

# Idiomas disponibles
- Español

## 🔌 Capa API y conexión a base de datos
- Capa API: `assets/js/core/api.js` abstrae el acceso a datos.
	- Hoy usa localStorage internamente.
	- Exponen métodos: `api.clients.list/get/create/update/remove` (y placeholders para `properties`, `users`).
	- Ya está integrada en Clientes; el resto puede migrarse igual.

### ¿Cómo conectarlo a una BD real?
Sustituye las funciones dentro de `api.js` por llamadas HTTP/SDK a tu backend/servicio. Mantén las mismas firmas para no tocar las vistas.

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
