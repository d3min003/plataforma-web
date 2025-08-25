# 🌐 CRM Web Inmobiliario (Frontend-only)

Plataforma CRM para gestión inmobiliaria sin backend. Todos los datos se almacenan en el navegador (localStorage). Ideal para demo, prototipos o uso personal sin servidor.

## 🚀 Demo
- Producción (Vercel): https://plataforma-web-gules.vercel.app/
- Código fuente (GitHub): https://github.com/d3min003/plataforma-web

## 🔑 Funciones principales
- Clientes: registro, edición, segmentación (presupuesto, zona, tipo).
- Propiedades: alta/edición, estado (disponible/negociación/reservado/vendido).
- Pipeline: tablero Kanban con drag & drop para cambiar estado.
- Asesores: listado básico desde datos seed.
- Configuración: exportar/importar JSON y reset local.

## 🛠️ Tecnologías
- Frontend: HTML, CSS, JavaScript
- Hosting: Vercel

## ▶️ Uso (sin localhost)
- Producción: usa la URL de Vercel indicada arriba.
- Sin servidor local: abre `index.html` directamente en tu navegador si necesitas probar offline.

## 📦 Estructura
```
.
├─ index.html
├─ /css
│  └─ styles.css
├─ /js
│  ├─ app.js        # arranque y rutas
│  ├─ router.js     # enrutador por hash
│  ├─ storage.js    # wrapper de localStorage + seed
│  └─ views.js      # vistas y bindings
```

## 🗺️ Roadmap (MVP)
- [x] CRUD clientes (localStorage)
- [x] CRUD propiedades + estados
- [x] Tablero Kanban con drag & drop
- [x] Listado de asesores (seed)
- [x] Exportar/Importar JSON
- [ ] Filtros avanzados y búsqueda
- [ ] Métricas básicas (dashboard)
- [ ] PWA (offline + installable)

# Idiomas disponibles
- Español
