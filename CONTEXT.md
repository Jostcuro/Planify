# CONTEXT.md — Proyecto TaskManager

## Stack
- Frontend: React 18 + Vite 5 + TypeScript 5 + Tailwind CSS 3 + shadcn/ui
- Animaciones: Aceternity UI (solo landing + header dashboard)
- Auth: Clerk (React SDK frontend, Express SDK backend)
- Backend: Node.js 20 + Express 4 + TypeScript
- DB: PostgreSQL 15 + Prisma ORM 5
- HTTP Client: Axios

## Arquitectura Backend
- Capas: Routes → Controllers → Services
- Auth: ClerkExpressRequireAuth() + injectUser middleware
- Prisma Client: singleton en src/config/db.ts
- Respuesta estándar: { success: boolean, data: any, error?: string }

## Schema Prisma (Resumen)
- User: id (Clerk ID), email, name
- Category: id, name, color, userId
- Task: id, title, description, status (BACKLOG|TODO|IN_PROGRESS|IN_REVIEW|COMPLETED|CANCELLED), priority (LOW|MEDIUM|HIGH|URGENT), dueDate, completedAt, userId, categoryId
- Subtask: id, title, completed, taskId
- Relaciones: User 1:N Task/Category | Category 1:N Task | Task 1:N Subtask

## Estructura de Carpetas
Backend (/server)
server/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   └── db.ts
│   ├── middlewares/
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── controllers/
│   │   ├── task.controller.ts
│   │   ├── category.controller.ts
│   │   └── metrics.controller.ts
│   ├── services/
│   │   ├── task.service.ts
│   │   ├── category.service.ts
│   │   └── metrics.service.ts
│   ├── routes/
│   │   ├── task.routes.ts
│   │   ├── category.routes.ts
│   │   └── metrics.routes.ts
│   ├── types/
│   │   └── express.d.ts
│   └── app.ts
├── .env
├── package.json
└── tsconfig.json

Frontend (/client)
client/
├── src/
│   ├── components/
│   │   ├── ui/             # Componentes shadcn/ui
│   │   ├── aceternity/     # Componentes visuales Aceternity UI
│   │   ├── layout/         # Header, Sidebar, DashboardLayout
│   │   ├── tasks/          # TaskCard, TaskTable, TaskFormModal
│   │   ├── calendar/       # CalendarView
│   │   └── metrics/        # MetricsOverview, Charts
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── CalendarPage.tsx
│   │   └── MetricsPage.tsx
│   ├── services/
│   │   └── api.ts          # Axios / Fetch client con interceptor de Clerk
│   ├── hooks/
│   │   └── useTasks.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts

## Reglas Inquebrantables
1. NO usar alert() ni console.log() en producción
2. Toda validación de inputs con Zod
3. Frontend: TanStack Query para server state, Zustand para UI state
4. shadcn/ui para toda la interfaz funcional
5. Backend: NUNCA acceder a req/res desde Services
6. Commits en git después de cada prompt exitoso