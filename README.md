# 💻 Plataforma Web (CRM)

![estado](https://img.shields.io/badge/estado-EN%20DESARROLLO-blue)
![node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![next](https://img.shields.io/badge/Next.js-13%2B-black)
![typescript](https://img.shields.io/badge/TypeScript-5%2B-3178C6)
[![vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://plataforma-web-gules.vercel.app/)

## Producción
- URL: https://plataforma-web-gules.vercel.app/
- Estado: EN LÍNEA ✅

Rutas actuales
- Páginas: `/`, `/dashboard`, `/leads`, `/properties`, `/404`
- APIs: `/api/health`, `/api/leads` (GET/POST), `/api/properties` (GET/POST)

## Qué incluye hoy
- UX/UI: Tema MUI v7 con modo claro/oscuro, Layout con AppBar y navegación, páginas Inicio, Dashboard, Leads y Propiedades, 404.
- Backend: API Routes (Next.js) con almacenamiento en memoria para leads/propiedades y healthcheck.

## Próximos pasos
1) Drawer responsive y páginas de autenticación.
2) Conectar APIs reales (Base Centralizada) y RTK Query.
3) Tests (unit/integración) y CI.
4) Charts en Dashboard (Recharts/Victory) con KPIs reales.

## Cómo ejecutar (local)
Requisitos: Node.js 18+, npm/pnpm/yarn

```powershell
npm install
npm run dev
# producción
npm run build
npm run start
```

## Stack breve
- Frontend: React 18 + TypeScript + Next.js 13 (Pages Router), MUI v7 + Emotion.
- Backend: Next.js API Routes (mock in-memory).
- Deploy: Vercel (builder Next.js, salida .next vía `vercel.json`).

## Variables de entorno
Copia `.env.example` a `.env.local` y define según necesites:
- NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_API_URL, NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
- SENDGRID_API_KEY, SENTRY_DSN (opcional)

## Despliegue en Vercel (resumen)
1) Framework: Next.js, Root: `/`, Build: `npm run build`, Output: `.next`.
2) Este repo incluye `vercel.json` para forzar el builder de Next.js.
3) Si ves 404 o “missing public”: Redeploy → Clear Build Cache.

## Rutas de prueba (local)
- http://localhost:3000/
- http://localhost:3000/leads
- http://localhost:3000/properties
- http://localhost:3000/api/health
- http://localhost:3000/api/leads (GET/POST)
- http://localhost:3000/api/properties (GET/POST)
