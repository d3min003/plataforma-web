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
│     │  └─ storage.js      # wrapper de localStorage + sesión + hash
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
