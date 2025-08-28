# CRM Backend (Express + PostgreSQL + JWT)

Backend ligero para desplegar junto a la base de datos PostgreSQL en el servidor físico. Expone endpoints mínimos y seguros, pensados para frontend en Vercel.

## Endpoints
- POST /api/auth/login → { email, password } → { token }
- POST /api/auth/logout → stateless (frontend borra token)
- GET /api/user/me → datos del usuario autenticado
- GET /api/customers → lista de clientes (máx 500)
- POST /api/customers → crear cliente
- GET /api/notes?customerId=UUID → notas
- POST /api/notes → crear nota { customerId, text }

Todas las rutas (excepto login/logout) requieren header Authorization: Bearer <token>.

## JWT
- Firmado con HS256 usando JWT_SECRET
- issuer/audience configurables (JWT_ISSUER/JWT_AUDIENCE)
- expiración configurable (JWT_EXPIRES_IN, p.ej. 1d)
- Middleware `requireAuth` valida el token y coloca `req.user`

## Conexión a PostgreSQL
- Usa `pg` con Pool
- Variables `.env`: PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD
- Script SQL en `sql/schema.sql`

## Puesta en marcha
1. Copia `.env.example` a `.env` y ajusta valores
2. Crea las tablas:
   - psql -h $PGHOST -U $PGUSER -d $PGDATABASE -f sql/schema.sql
3. Instala dependencias y ejecuta:
   - npm install
   - npm run seed  # crea admin inicial
   - npm start

## Seguridad y mejores prácticas
- HTTPS obligatorio entre Vercel y backend (configura Nginx/Traefik con TLS en el servidor físico)
- CORS restringido a tu dominio de Vercel (`CORS_ORIGIN`)
- Rate limiting, Helmet y logs activados
- No exponer PostgreSQL a Internet; escucha en localhost o red interna
- Rotar `JWT_SECRET` y credenciales en caso de incidente

## Sesiones multi-dispositivo
- JWT stateless permite iniciar sesión desde múltiples equipos sin conflicto
- Para revocación selectiva, considera una tabla `token_blacklist` o `token_version` por usuario y valida en `requireAuth`
- Opcional: refresh tokens de larga duración y access tokens de corta duración

## Estructura
- src/server.js → app Express y wiring
- src/db/pool.js → pool PostgreSQL
- src/auth/jwt.js → firmado/verificación JWT
- src/middlewares/auth.js → middleware de autenticación
- src/routes/*.js → rutas (auth, user, customers, notes)
- sql/schema.sql → esquema básico
- src/scripts/seedAdmin.js → crea usuario admin inicial

## Ejemplo de uso desde el frontend
- POST /api/auth/login con { email, password }
- Guardar token en memory/secure storage; enviar en header Authorization: Bearer
- Consumir /api/user/me, /api/customers, /api/notes
