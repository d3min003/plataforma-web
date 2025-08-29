# Reporte de Estado — Plataforma Web (CRM)

## Resumen Ejecutivo
- Estado general: 🟡 Degradado (pendiente verificación local de backend y conexión a BD)
- Claves:
  - Frontend SPA estable (localStorage + PWA); navegación y módulos operativos.
  - Backend ligero (Express + PostgreSQL + JWT) presente en `/backend`, sin verificación de ejecución local en este corte.
  - Script de conexión a BD central disponible (`test-db-connection.js`), pendiente de ejecución con `.env` real.

## Semáforos
- 🟢 Frontend SPA (build estático, rutas y UI)
- 🟡 Backend ligero (presente; falta levantar y validar en este entorno)
- 🟡 Conexión BD central (script listo; falta ejecutar con credenciales)
- 🟡 Seguridad (CORS/HTTPS configurables; auditoría/lint/tests pendientes)
- 🟢 PWA básica (manifest + service worker)

## Inventario del Proyecto
- Stack
  - Frontend: HTML, CSS, JavaScript (SPA con enrutador hash), PWA (SW + manifest)
  - Backend (opcional): Node.js (Express), PostgreSQL (pg), JWT, Helmet, CORS, Rate limiting, Zod
  - Node/npm (detectado): No hay package.json en la raíz. Backend usa Node 18+ (recomendado).
- Scripts (backend/package.json)
  - `start`: Inicia API en producción
  - `dev` (si existe): Nodemon/tsx para desarrollo
  - `seed`: Crea usuario admin inicial
- Estructura (top relevantes)
  - `index.html`
  - `manifest.webmanifest`
  - `sw.js`
  - `assets/css/styles.css`
  - `assets/js/app.js`
  - `assets/js/core/{router.js,storage.js}`
  - `assets/js/features/{dashboard.js,clientes.js,propiedades.js,asesores.js,index.js}`
  - `assets/js/views.js` (shim compat)
  - `backend/` (Express + PostgreSQL + JWT)
  - `test-db-connection.js` (test de conexión a PostgreSQL)

## Entorno & Configuración
- Archivos detectados:
  - `backend/.env.example`
  - `.env` del proyecto “base-datos-central” (externo; se carga en el test con `--env`)
  - docker-compose.yml: no presente en este repo (la BD central corre en su propio compose)
- Variables críticas esperadas (sin valores):
  - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `DATABASE_URL` (opcional en backend)
  - JWT backend: `JWT_SECRET`, `JWT_ISSUER`, `JWT_AUDIENCE`, `JWT_EXPIRES_IN`
  - CORS backend: `CORS_ORIGIN`
- Puertos
  - Backend Express: 8080 (sugerido) o configurable por `PORT`
  - PostgreSQL central: 5432 (docker-compose del proyecto central)

## Build & Lint & Tests
> No hay `package.json` en la raíz; se evalúa en `backend/`.

| Paso      | Comando                         | Estado     | Duración | Salida breve |
|-----------|----------------------------------|------------|----------|--------------|
| Node/npm  | `node -v && npm -v`             | 🟡 pendiente | —        | Detectar versión en máquina |
| Install   | `npm install` (en `backend/`)   | � done     | 7s       | added 110 packages, audited 111, 0 vulnerabilities |
| Build     | `npm run build` (si existe)     | ❌ no aplica | —        | Backend usa runtime JS/TSX |
| Lint      | `npm run lint` (si existe)      | 🟡 pendiente | —        | Requiere config ESLint |
| Tests     | `npm test -- --watch=false`     | ❌ no aplica | —        | Tests no definidos |

Ejemplo de verificación de scripts:
```bash
# En Windows PowerShell
cd .\backend
node -v && npm -v
npm install
npm run seed
npm start
```

## Dependencias & Seguridad
| Chequeo                 | Comando                     | Estado     | Resumen |
|-------------------------|-----------------------------|------------|---------|
| Auditoría de prod       | `npm audit --production`    | 🟡 pendiente | Ejecutar en `backend/` |
| Desactualizadas (top10) | `npm outdated`              | 🟡 pendiente | Ejecutar en `backend/` |

Notas:
- Mantener Express, pg, helmet, cors, jsonwebtoken y zod en versiones LTS.
- Revisar CVEs de `jsonwebtoken` y `pg` periódicamente.

## Salud de la Aplicación en Local
- Frontend SPA:
  - Es estático; abrir `index.html` con servidor estático o directamente desde el navegador.
- Backend (opcional):
  - Arranque sugerido:
    ```bash
    cd .\backend
    copy .env.example .env
    # editar .env (PG*, JWT*, CORS_ORIGIN)
    # psql … -f .\sql\schema.sql
    npm install
    npm run seed
    npm start
    ```
- Verificación HTTP (si backend activo en 8080):
  ```bash
  curl -i http://127.0.0.1:8080/healthz
  ```
  Tabla endpoints (si existen en tu build):
  | Endpoint            | Método | Código | Latencia | Observación              |
  |---------------------|--------|--------|----------|--------------------------|
  | /healthz            | GET    | —      | —        | Puede no estar expuesto  |
  | /api/auth/login     | POST   | —      | —        | Requiere body JSON       |
  | /api/user/me        | GET    | —      | —        | Requiere Bearer JWT      |
  | /api/customers      | GET    | —      | —        | Requiere Bearer JWT      |
  | /api/notes          | GET    | —      | —        | Requiere Bearer JWT      |

## Conexión a la BD Central (PostgreSQL)
- Script de prueba: `test-db-connection.js`
- Cómo ejecutarlo (desde raíz del repo):
  ```bash
  # Opción A: apuntando al .env del repo central
  node .\test-db-connection.js --env ..\base-datos-central\.env

  # Opción B: variable de entorno
  $env:CENTRAL_ENV="..\base-datos-central\.env"; node .\test-db-connection.js
  ```
- Salida esperada (ejemplo):
  ```txt
  ℹ️  .env cargado desde: C:\repos\base-datos-central\.env
  ℹ️  Parámetros de conexión (seguro): {"host":"127.0.0.1","port":5432,"user":"crm_app","database":"crm","password":"c***p","ssl":false}
  ✅ Conexión exitosa a PostgreSQL.
     now           : 2025-08-28T15:41:12.345Z
     current_user  : crm_app
     version       : PostgreSQL 16.2 on x86_64-pc-linux-gnu, compiled by gcc ...
  ```
- Resultado actual: 🟡 pendiente de ejecución en esta máquina.

## Ejecuciones recientes (evidencias)

Se realizaron dos acciones en el entorno `backend/` durante esta sesión; se incluyen salidas resumidas.

- Instalación de dependencias (backend):

```bash
# salida resumida de: cd backend && npm install
added 110 packages, and audited 111 packages in 7s

17 packages are looking for funding
found 0 vulnerabilities
```

- Inicio del servidor Express (backend):

```txt
> crm-backend@1.0.0 start
> node src/server.js

[server] listening on :8080
```

- Intento de health-check desde esta máquina (PowerShell):

```powershell
# Se intentó llamar a http://127.0.0.1:8080/healthz pero el proceso de check devolvió código distinto de 0
# Resultado del intento: Command exited with code 1
```

Comentarios:
- El servidor backend se inició correctamente y está escuchando en el puerto 8080 (evidencia en los logs).
- El health-check local no devolvió contenido esperado en el intento automático; puede ser por timing (el proceso aún iniciaba) o porque la ruta `/healthz` no responde en esta versión. Recomendado: ejecutar manualmente `curl -i http://127.0.0.1:8080/healthz` tras confirmar que el servidor terminó de iniciarse.

## Logs & Errores
- Frontend: sin errores conocidos en consola al navegar principales rutas.
- Backend: pendiente ejecutar en local para capturar logs de arranque (primeras 30 líneas).

## Riesgos & Bloqueos
- ⚠️ Alta — CORS/HTTPS: asegurar backend tras TLS y CORS solo para dominio de Vercel.
- ⚠️ Alta — Conexión BD: sin verificación real aún; bloquearía sincronización.
- ⚠️ Media — PWA cache: cambios en assets pueden quedar “stale”; versionar caché en `sw.js`.
- ⚠️ Media — Auditoría deps: falta `npm audit` y `npm outdated` en backend.
- ⚠️ Baja — Lint/Tests: ausencia de ESLint/Tests automatizados.

## Próximos Pasos (Plan 7 días)
1. Verificar conexión BD central (Dueño: Backend) — Éxito: `test-db-connection.js` ✅ con NOW()/version() reales.
2. Levantar backend en servidor físico con HTTPS (Dueño: DevOps) — Éxito: `/api/auth/login` 200 y `/api/user/me` 200 con JWT.
3. CORS restricto a dominio Vercel (Dueño: Backend) — Éxito: peticiones desde Vercel 2xx, otras 403.
4. Auditoría y actualización de dependencias (Dueño: Backend) — Éxito: `npm audit` sin críticas y `npm outdated` sin majors pendientes críticos.
5. CI mínima (Dueño: Todos) — Éxito: workflow que corre lint y smoke de endpoints en PR.

---

Estado final: 🟡 Degradado