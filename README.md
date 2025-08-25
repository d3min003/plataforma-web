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
- Frontend: HTML, CSS, JavaScript (vanilla, SPA con hash routing)
- Persistencia: localStorage (namespace crmInmo_v1)
- Hosting: Vercel

## ▶️ Ejecutar localmente (Windows PowerShell)
Opción A (rápida): abrir `index.html` con el navegador.

Opción B (servidor estático, requiere Node.js):

```powershell
npx http-server . -p 8080
# luego abre http://localhost:8080
```

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
- [ ] Galería de imágenes por propiedad
- [ ] PWA (offline + installable)

## ⚠️ Notas
- Los datos se guardan en tu navegador. Si borras el storage, se pierde la info.
- Usa Configuración → Exportar para generar un backup en JSON.

## 📬 Contacto
- Autor: d3min003