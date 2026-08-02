<div align="center">

<img src="./client/public/images/dragon-50.png" width="120px" alt="Planify" />

# Planify

<i>Gestor de tareas moderno y colaborativo — panel Kanban, calendario, métricas y autenticación segura con Clerk.</i>

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-2.0-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4.4-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-5.32-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)

![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![React Router](https://img.shields.io/badge/React%20Router-6-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-3-22B8CF?style=for-the-badge&logo=recharts&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

</div>

---

## 📸 Capturas de pantalla

| Landing | Dashboard (Lista) |
|---|---|
| <img src="./docs/screenshots/landing.png" width="100%" /> | <img src="./docs/screenshots/dashboard.png" width="100%" /> |

| Kanban | Calendario |
|---|---|
| <img src="./docs/screenshots/kanban.png" width="100%" /> | <img src="./docs/screenshots/calendar.png" width="100%" /> |

| Métricas | Categorías |
|---|---|
| <img src="./docs/screenshots/metrics.png" width="100%" /> | <img src="./docs/screenshots/categories.png" width="100%" /> |

---

## 🚀 Características principales

- ✅ **Tablero Kanban** drag & drop (dnd-kit) con estados `BACKLOG → TODO → IN_PROGRESS → IN_REVIEW → COMPLETED`.
- 📅 **Calendario** con vista mensual de tareas (react-day-picker).
- 📊 **Métricas y gráficos** (recharts): pendientes por prioridad, estados y evolución.
- 🗂️ **Categorías** personalizadas con color.
- ✅ **Subtareas** anidadas (máx. 20 por tarea).
- 🔍 **Filtros avanzados**: estado, prioridad, categoría, búsqueda, rango de fechas y ordenación.
- 🔐 **Autenticación y multi-tenant** con Clerk (cada usuario solo ve sus datos).
- 🛡️ **Seguridad**: validación Zod, helmet (CSP), rate-limiting y errores 5xx genéricos.
- ⚡ **SPA optimizada**: lazy loading por rutas, TanStack Query, toasts y error boundaries.
- 🧪 **Tests automatizados** con Vitest (63 client + 4 server).

## 🛠️ Tech Stack

| Capa | Tecnología |
|---|---|
| **Frontend** | React 18 · Vite 5 · TypeScript 5 · Tailwind CSS 3 · shadcn/ui · TanStack Query 5 · React Router 6 · Recharts 3 · dnd-kit · Framer Motion |
| **Backend** | Node.js 22+ · Express 4 · TypeScript (ESM) · Prisma 5 · PostgreSQL 15 · Zod 4 |
| **Autenticación** | Clerk (`@clerk/clerk-react` + `@clerk/express` v2) |
| **Testing** | Vitest 4 · Testing Library · jsdom |
| **CI/CD** | GitHub Actions (typecheck → tests → build) |

## ⚙️ Requisitos Previos e Instalación

### Requisitos previos

- **Node.js ≥ 22.19**
- **PostgreSQL 15** (local o en la nube)
- Una **aplicación Clerk** con sus claves (https://dashboard.clerk.com)

### 1. Configurar variables de entorno

Copia los `.env.example` y completa los valores. **Nunca versiones los `.env`.**

**Server (`server/.env`):**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/planify"
CLERK_SECRET_KEY="sk_test_your_clerk_secret_key"
CLERK_PUBLISHABLE_KEY="pk_test_your_clerk_publishable_key"
PORT=5000
CLIENT_URL="http://localhost:5173"
NODE_ENV="development"
```

> El servidor **no arranca** si faltan `DATABASE_URL` o `CLERK_SECRET_KEY` (validación fail-fast con Zod).

**Client (`client/.env`):**

```env
VITE_CLERK_PUBLISHABLE_KEY="pk_test_xxx"   # misma publishable key de Clerk
VITE_API_URL="http://localhost:5000"
```

### 2. Instalar dependencias y levantar la base de datos

```bash
cd server
npm install
npm run prisma:migrate    # aplica migraciones (en CI/prod: prisma migrate deploy)
npm run db:seed           # opcional: datos demo

cd ../client
npm install
```

### 3. Iniciar servidor y cliente

```bash
# Terminal 1 — servidor (puerto 5000)
cd server
npm run dev

# Terminal 2 — cliente (puerto 5173)
cd client
npm run dev
```

Abre http://localhost:5173

### Scripts útiles

| Comando (server) | Descripción | Comando (client) | Descripción |
|---|---|---|---|
| `npm run dev` | API con `tsx watch` | `npm run dev` | Vite dev server |
| `npm run build` | `prisma generate` + `tsc` | `npm run build` | `tsc --noEmit` + `vite build` |
| `npm start` | Ejecuta `dist/server.js` | `npm run preview` | Sirve el build de producción |
| `npm run typecheck` | Verificación de tipos | `npm test` | Tests con Vitest |
| `npm test` | Tests con Vitest | `npm run test:watch` | Tests en modo watch |
| `npm run db:seed` | Datos demo | | |

## 📁 Estructura del Proyecto

```
planify/
├── server/                    # API Express (routes → controllers → services)
│   ├── prisma/                # schema.prisma, migraciones y seed
│   └── src/
│       ├── config/            # env.ts (fail-fast), db.ts (singleton Prisma)
│       ├── middlewares/       # auth (Clerk), errorHandler, asyncHandler, validate
│       ├── controllers/       # category · task · metrics
│       ├── services/          # lógica de negocio (nunca toca req/res)
│       ├── routes/            # auth · category · task · metrics
│       └── types/             # schemas Zod y HttpError
├── client/                    # SPA React (Vite)
│   └── src/
│       ├── components/        # ui/ (shadcn) · aceternity/ · layout/ · tasks/ · calendar/ · metrics/ · categories/
│       ├── pages/             # Landing · Dashboard · Calendar · Metrics
│       ├── services/          # Axios client + módulos de API
│       ├── hooks/             # useTasks, useCategories, useSubtasks…
│       └── lib/               # validaciones, formateo, kanban helpers
├── .github/workflows/ci.yml   # CI: typecheck + tests + build
└── PROJECT_CONTEXT.md         # Documento técnico de arquitectura
```

## 🔐 Seguridad

- Toda ruta de `/api` protegida con `clerkMiddleware` (excepto `/health`).
- Entrada validada con esquemas **Zod** (body y query) y multi-tenant por `userId`.
- Cabeceras con **helmet** (CSP en producción con allowlist de Clerk).
- **Rate limiting**: 300 peticiones / 15 min por IP en `/api`.
- Errores 5xx genéricos, sin fuga de detalles internos.

## 📄 Licencia y Contacto

Distribuido bajo la licencia **MIT**.

- **Autor:** Johan Steven Cuero Rodríguez
- **Repositorio:** [https://github.com/Jostcuro/Planify](https://github.com/Jostcuro/Planify)
- **Reportar bugs / sugerencias:** abre un *issue* en el repositorio.

---

<p align="center">Hecho con ❤️ usando React, TypeScript y mucho café.</p>
