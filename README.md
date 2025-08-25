# 🌐 CRM Web Inmobiliario  

## 🎯 Objetivo
Plataforma CRM para gestión inmobiliaria que centraliza operaciones y optimiza el ciclo comercial.

## 🔑 Funciones principales
- **Clientes**
	- Registro y segmentación (presupuesto, zona, tipo de propiedad).
- **Propiedades**
	- Alta y gestión de inmuebles (precio, estado, ubicación).
	- Control de pipeline: disponible → negociación → reservado → vendido.
- **Asesores**
	- Gestión de cartera asignada (clientes + propiedades).
	- Métricas de desempeño individual.

## 🛠️ Tecnologías
- **Frontend:** React + Next.js + TypeScript + Material UI (deploy en Vercel)
- **Backend / API:** FastAPI / Node.js (según despliegue)
- **Base de datos:** PostgreSQL / SQLite (manejada externamente y conectada al API)
- **Comunicación:** Frontend ↔ API ↔ Base de datos

Monorepo con frontend y backend separados.

## Estructura
- frontend/ (Next.js + MUI)
- backend/ (Express + TypeScript)

## Cómo ejecutar
- Backend:
```powershell
cd backend
npm install
npm run dev
```
- Frontend:
```powershell
cd ../frontend
npm install
$env:NEXT_PUBLIC_API_URL = "http://localhost:4000"; npm run dev
```

## Endpoints backend
- GET http://localhost:4000/health
- GET/POST http://localhost:4000/leads
- GET/POST http://localhost:4000/properties

## Notas
- Variables ejemplo en `frontend/.env.example` y `backend/.env.example`.
- Ajusta CORS si consumes desde otro dominio.

## CI/CD y Vercel
- Proyecto de Vercel del frontend: `prj_M3pyUu8FksdEOIT7uXZuawSZpeYJ`
- Despliegue automático con GitHub Actions: `.github/workflows/vercel-frontend.yml`.
- Configura en GitHub/Repo/Settings/Secrets and variables/Actions:
	- `VERCEL_TOKEN`: token personal de Vercel.
	- `VERCEL_ORG_ID`: ID de la organización/equipo.
	- `VERCEL_PROJECT_ID`: `prj_M3pyUu8FksdEOIT7uXZuawSZpeYJ`.
- Variables de entorno del frontend en Vercel:
	- `NEXT_PUBLIC_API_URL`: URL del backend (por ejemplo, producción: API pública; preview: staging).
	- Puedes gestionar las envs con `vercel env` o `vercel pull`.
