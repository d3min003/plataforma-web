# 🌐 CRM Web Inmobiliario  

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
