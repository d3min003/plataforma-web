# Reporte de Estado — Plataforma Web (CRM)

## Resumen Ejecutivo
- Estado general: 🟡 Degradado — errores de conectividad e integración detectados en esta sesión.
- Hallazgos principales:
  - Backend Express presente en `backend/` pero no accesible desde esta máquina durante la verificación (ECONNREFUSED 127.0.0.1:8080).
  - El script de comprobación de BD (`test-db-connection.js`) falló cuando se ejecutó desde la raíz por falta del módulo `dotenv`; el script está pensado para ejecutarse con las dependencias disponibles (se recomienda ejecutarlo desde `backend/`).
  - El repo contiene `backend/.env.example` con valores placeholder; no hay `.env` con credenciales reales en este workspace — por tanto no se pudo verificar la conectividad real contra la BD central.
  - Auditoría de dependencias fue ejecutada en `backend/` y su salida se guardó en `audit-backend.json` (0 vulnerabilidades encontradas en el momento); `npm outdated` generó `outdated-backend.json` con paquetes con nuevas versiones.

## Estado de semáforos (resumen rápido)
- 🟢 Frontend SPA (build estático, rutas y UI)
- 🟡 Backend ligero (presente; fallo de health-check local en esta sesión)
- 🟡 Conexión BD central (script listo; falta ejecutarlo con `.env` real desde `backend/`)
- 🟡 Seguridad (CORS/HTTPS configurables; revisar y aplicar en producción)
- 🟢 PWA básica (manifest + service worker)

## Errores identificados (consecuencia / evidencia)
- Backend no respondiente
  - Error: ECONNREFUSED 127.0.0.1:8080
  - Estado: Health check local falló
  - Impacto: API no accesible desde frontend / pipelines de integración
  - Evidencia: intento GET a `/healthz` devolvió conexión rechazada en esta sesión
- Test de BD con dependencias faltantes
  - Error: "Cannot find module 'dotenv'" al ejecutar `node .\test-db-connection.js` desde la raíz
  - Estado: Script mal ubicado o ejecutado sin node_modules adecuados
  - Impacto: Sin verificación de conectividad con BD Central desde esta máquina
- Archivo `.env` ausente o con placeholders
  - Error: `backend/.env.example` contiene placeholders; no hay `.env` con credenciales reales
  - Estado: Sin credenciales reales configuradas en este workspace
  - Impacto: Imposible establecer conexión real a BD Central
- Persistencia local en frontend
  - Error: Uso principal de `localStorage` en frontend
  - Impacto: Datos quedan aislados en cada cliente sin sincronización central
- Integración AI inexistente
  - Error: No hay endpoints ni proxy hacia servicio AI
  - Impacto: No hay capacidades de análisis/insights automatizados
- JWT no compartido con AI/otros servicios
  - Error: No hay mecanismo documentado para compartir secretos o JWKS entre servicios
  - Impacto: Tokens no válidos entre servicios y problemas de interoperabilidad
- CORS sin restricciones para producción
  - Error: `CORS_ORIGIN` no fijado a dominios de producción en el entorno actual
  - Impacto: Riesgo de uso inapropiado por orígenes no deseados
- Auditoría de dependencias sin análisis completo
  - Error: `npm audit --production` ejecutado y guardado, pero resultados aún por revisar y priorizar (archivo `audit-backend.json`)
  - Impacto: Posibles vulnerabilidades o dependencias críticas sin plan de mitigación

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

Acciones ejecutadas en esta sesión (resumen y evidencias)

- Intento de health-check local:
  - Comando intentado desde PowerShell y Node: GET http://127.0.0.1:8080/healthz
  - Resultado: ERROR connect ECONNREFUSED 127.0.0.1:8080 (el servidor no respondió en el momento del chequeo).

- Intento de ejecutar `test-db-connection.js` desde la raíz del repo:
  - Comando: `node .\test-db-connection.js`
  - Resultado: fallo por dependencia ausente: "Cannot find module 'dotenv'". El script está diseñado para ejecutarse con las dependencias presentes (idealmente desde `backend/`).

- Auditoría y listado de paquetes:
  - Ejecutado: `npm audit --production` y `npm outdated` dentro de `backend/`.
  - Resultados guardados: `audit-backend.json` (0 vulnerabilidades), `outdated-backend.json` (lista de paquetes con versiones más recientes).

Recomendación inmediata y comandos reproducibles
1) Levantar backend localmente y reintentar health-check (haz esto en una terminal):
```powershell
cd .\backend
# (opcional) exportar origen CORS en dev
$env:CORS_ORIGIN = 'http://localhost:3000'
npm start
```
En otra terminal:
```powershell
Invoke-WebRequest -Uri 'http://127.0.0.1:8080/healthz' -UseBasicParsing -TimeoutSec 5
```
2) Ejecutar test de conexión a BD usando `.env` real (desde `backend/` para aprovechar node_modules):
```powershell
# Si el .env del repo central está en ../base-datos-central/.env
$env:CENTRAL_ENV_PATH = 'C:\ruta\a\base-datos-central\.env'
cd .\backend
node ..\test-db-connection.js
```
3) Consultar resultados de auditoría y paquetes desactualizados (archivos guardados):
```powershell
# Revisa los JSON generados en la raíz
Get-Content .\audit-backend.json -Raw
Get-Content .\outdated-backend.json -Raw
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

## Plan de acción — Plataforma Web (CRM)

## Checklist inicial
- Levantar backend local desde `backend/` y validar `/healthz`.
- Ejecutar `test-db-connection.js` desde `backend/` con `.env` real.
- Restringir CORS y asegurar JWT.

## Problema principal
- Backend Express no accesible localmente (ECONNREFUSED 127.0.0.1:8080); `.env` con placeholders y scripts ejecutados desde ruta incorrecta.

## Objetivo
- Levantar backend local de forma reproducible, verificar conexión a la BD central y asegurar políticas CORS/JWT.

## Acciones inmediatas (0–24 h)
1) Instalar dependencias y arrancar backend desde `backend/`:

```powershell
cd "C:\Users\J4vie\Desktop\alma gen\backend"
npm install
copy .env.example .env
# editar .env con credenciales reales (PG*, JWT*, CORS_ORIGIN)
npm start
```

2) Validar healthz desde otra terminal:

```powershell
Invoke-WebRequest -Uri 'http://127.0.0.1:8080/healthz' -UseBasicParsing -TimeoutSec 5
```

3) Ejecutar `test-db-connection.js` desde `backend/` para que node_modules estén disponibles:

```powershell
cd "C:\Users\J4vie\Desktop\alma gen\backend"
node ..\test-db-connection.js --env "C:\ruta\a\base-datos-central\.env"
```

## Plan 7 días
- Restringir CORS a dominios de producción y habilitar HTTPS en staging.
- Asegurar `JWT_SECRET` y documentar intercambio de tokens entre servicios.
- Reemplazar usos críticos de `localStorage` por sincronización server-backed o estrategias offline controladas.

## Plan 30 días
- Añadir CI: lint, tests y smoke tests que validen health y endpoints en PRs.
- Versionar caché PWA y mejorar strategy de precache en `sw.js`.

## Criterios de aceptación
- `Invoke-WebRequest http://127.0.0.1:8080/healthz` devuelve 200 cuando backend está arriba.
- `test-db-connection.js` muestra conexión exitosa y `current_user` esperado.
- CORS bloquea orígenes no autorizados en staging/prod.

## Riesgos y precauciones
- No desplegar CORS permisivo a producción; probar primero en staging.
- Rotar JWT sin plan de migración puede desconectar usuarios activos.

## Estimados
- Levantar backend y test DB: 1–3 horas.
- CORS/JWT y CI básica: 2–5 días.

## Responsable sugerido
- Backend developer / DevOps: ejecutar y validar.