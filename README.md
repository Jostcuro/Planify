# Planify

Gestor de tareas (TaskManager) con autenticación mediante Clerk, panel tipo Kanban/lista, calendario y métricas. Backend Express + Prisma/PostgreSQL y frontend React + Vite.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18, Vite 5, TypeScript, Tailwind CSS 3, shadcn/ui, TanStack Query, react-router-dom, recharts, dnd-kit |
| Backend | Node.js 20, Express 4, TypeScript (ESM), Prisma 5, PostgreSQL 15, Zod |
| Auth | Clerk (`@clerk/clerk-react` + `@clerk/express` v2) |
| CI | GitHub Actions (typecheck, tests, build) |

## Estructura

```
.
├── server/   # API Express (rutas → controllers → services)
├── client/   # SPA React (Vite)
├── .github/workflows/ci.yml
└── PROJECT_CONTEXT.md  # Documento técnico de arquitectura y decisiones
```

## Requisitos

- Node.js >= 20
- PostgreSQL 15
- Instancia de Clerk (claves de API)

## Configuración

Copia los archivos de ejemplo y completa los valores reales. **Nunca versiones los `.env`.**

### Server (`server/.env`)

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/planify"
CLERK_SECRET_KEY="sk_test_..."
PORT=5000
CLIENT_URL="http://localhost:5173"
NODE_ENV="development"
```

El servidor **no arranca** si faltan `DATABASE_URL` o `CLERK_SECRET_KEY` (validación fail-fast con Zod).

### Client (`client/.env`)

```env
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
VITE_API_URL="http://localhost:5000/api"
```

## Instalación y arranque

```bash
# 1. Base de datos
cd server
npm install
npm run prisma:migrate    # aplica migraciones (interactivo: usar `prisma migrate deploy` en CI/prod)
npm run db:seed           # opcional: datos demo

# 2. Servidor (puerto 5000)
npm run dev

# 3. Cliente (puerto 5173)
cd ../client
npm install
npm run dev
```

## Scripts

### Server

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor con `tsx watch` |
| `npm run build` | `prisma generate` + compilación de TypeScript |
| `npm start` | Ejecuta `dist/server.js` |
| `npm run typecheck` | Verificación de tipos |
| `npm test` | Tests con Vitest |
| `npm run db:seed` | Datos demo |

### Client

| Comando | Descripción |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc --noEmit` + `vite build` |
| `npm run preview` | Sirve el build de producción |
| `npm test` | Tests con Vitest |
| `npm run test:watch` | Tests en modo watch |

## Seguridad

- Autenticación de todo `/api` mediante `clerkMiddleware` (excepto `/health`).
- Toda entrada validada con esquemas Zod (body, query; multi-tenant filtrado por `userId`).
- Cabeceras de seguridad con `helmet` (CSP activa en producción con allowlist de Clerk).
- Rate limiting (300 peticiones / 15 min por IP) en `/api`.
- Respuestas de error 5xx genéricas (sin fuga de detalles internos).
- Errores de validación del server expuestos en la UI vía `details` de Zod.

## Despliegue

1. Aplicar migraciones: `prisma migrate deploy`.
2. Construir y servir el cliente (los estáticos de `client/dist` o un CDN).
3. Ejecutar el servidor con `NODE_ENV=production` y `CLIENT_URL` apuntando al dominio del frontend.
