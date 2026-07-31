# CONTEXT.md — Proyecto TaskManager

## Stack
- Frontend: React 18 + Vite 5 + TypeScript 5 + Tailwind CSS 3 + shadcn/ui (NO iniciado aún)
- Animaciones: Aceternity UI (solo landing + header dashboard)
- Auth: Clerk (React SDK frontend, Express SDK backend `@clerk/express` v2)
- Backend: Node.js 20 + Express 4 + TypeScript (ESM)
- DB: PostgreSQL 15 + Prisma ORM 5
- Validación: Zod (v4)
- HTTP Client: Axios

## Arquitectura Backend
- Capas: Routes → Controllers → Services (Controller nunca toca Prisma; Service nunca toca req/res)
- Auth: `clerkMiddleware()` montado en `/api` + `requireAuth`/`injectUser` (usan `getAuth(req)`, NO `req.auth` que es interno en @clerk/express v2)
- Errores asíncronos: `asyncHandler` envuelve handlers y propaga al `errorHandler`
- Validación: `validateBody` (parsea y reemplaza `req.body`) y `validateQuery` (parsea y guarda en `res.locals.query`)
- Errores de dominio: clase `HttpError(status, message)` lanzada desde Services
- Prisma Client: singleton en `src/config/db.ts`
- Respuesta estándar (éxito): `{ success: true, data }`
- Respuesta de error: `{ success: false, error: string }`; en 400 de Zod: `{ success: false, error: "Validación fallida", details: [{ path, message }] }`

## Endpoints API (montados bajo /api)
Todos requieren auth (excepto `/health`). `/health` NO pasa por Clerk.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/auth/me | Devuelve el usuario Clerk autenticado |
| GET | /api/categories | Lista categorías del usuario (orden alfabético) |
| POST | /api/categories | Crea categoría (201) |
| PATCH | /api/categories/:id | Actualiza categoría |
| DELETE | /api/categories/:id | Elimina categoría (las tareas quedan con categoryId null vía onDelete SetNull) |
| GET | /api/tasks | Lista tareas con filtros (ver abajo) |
| GET | /api/tasks/:id | Tarea con category + subtasks |
| POST | /api/tasks | Crea tarea con subtasks anidados |
| PATCH | /api/tasks/:id | Actualiza tarea |
| DELETE | /api/tasks/:id | Elimina tarea |

### Filtros GET /api/tasks
- `status`: CSV de TaskStatus (p.ej. `status=TODO,IN_PROGRESS`)
- `priority`: CSV de TaskPriority
- `categoryId`: id exacto
- `search`: OR case-insensitive sobre title/description
- `dueDateFrom` / `dueDateTo`: rango de fechas (to >= from validado)
- `sortBy`: id | title | status | priority | dueDate | completedAt (default dueDate)
- `order`: asc | desc (default asc; en desc los dueDate NULL van primero)

## Convenciones de errores
- Duplicado de categoría (case-insensitive) → 409
- Recurso inexistente o de otro usuario → 404
- Categoría no propia al asignar tarea → 400
- Body vacío en PATCH / tarea no propia → 400 / 404
- Cualquier input inválido → 400 con `details`
- 5xx → mensaje genérico + `console.error`

## Reglas de negocio
- Toda query/escritura se filtra por `userId` (multi-tenant)
- `completedAt` lo gestiona el Service: al pasar a COMPLETED → now; al salir de COMPLETED → null; si sigue COMPLETED se conserva (coherente con CHECK constraint de BD)
- `createTask`/`updateTask` validan que `categoryId` pertenezca al usuario (400 si no)
- Los subtasks solo se crean anidados en `createTask` (máx. 20); actualización de subtasks aún pendiente

## Schema Prisma (Resumen)
- User: id (Clerk ID), email (único), name
- Category: id, name, color (#hex 6 dígitos), userId
- Task: id, title, description, status (BACKLOG|TODO|IN_PROGRESS|IN_REVIEW|COMPLETED|CANCELLED), priority (LOW|MEDIUM|HIGH|URGENT), dueDate, completedAt, userId, categoryId
- Subtask: id, title, completed, taskId
- Relaciones: User 1:N Task/Category | Category 1:N Task | Task 1:N Subtask
- Integridad: User.email único; índices (userId, status) y (userId, dueDate); CHECK status=COMPLETED ↔ completedAt NOT NULL

## Seed (prisma/seed.ts)
- Usuario demo `user_demo_123` (demo@taskmanager.com, Demo User)
- 3 categorías: Trabajo #ef4444, Personal #3b82f6, Estudio #22c55e
- 12 tareas (2 por status), 10 subtasks, prioridades LOW 3 / MEDIUM 4 / HIGH 3 / URGENT 2
- Transaccional e idempotente; assert de QA al final
- Ejecutar: `npm run db:seed`

## Scripts (server/package.json)
- `dev`: tsx watch src/server.ts | `typecheck`: tsc --noEmit | `build`: prisma generate + tsc
- `start`: node dist/server.js | `db:seed` | `prisma:generate` | `prisma:migrate` | `prisma:studio`
- Nota: `prisma migrate dev` requiere terminal interactiva; en este entorno usar migraciones manuales + `prisma migrate deploy`

## Estructura de Carpetas
Backend (/server) — implementado
```
server/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/          # init + data_integrity
│   └── seed.ts
├── src/
│   ├── config/
│   │   └── db.ts
│   ├── middlewares/
│   │   ├── auth.ts          # requireAuth, injectUser (getAuth)
│   │   ├── errorHandler.ts  # notFound, errorHandler
│   │   ├── asyncHandler.ts
│   │   └── validate.ts      # validateBody, validateQuery
│   ├── controllers/
│   │   ├── category.controller.ts
│   │   ├── task.controller.ts
│   │   └── metrics.controller.ts   # PENDIENTE
│   ├── services/
│   │   ├── category.service.ts
│   │   ├── task.service.ts
│   │   └── metrics.service.ts      # PENDIENTE
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── category.routes.ts
│   │   ├── task.routes.ts
│   │   └── metrics.routes.ts       # PENDIENTE
│   ├── types/
│   │   ├── express.d.ts            # userId?: string en Express.Request
│   │   ├── http-error.ts           # HttpError
│   │   ├── category.schema.ts      # zod
│   │   └── task.schema.ts          # zod
│   ├── app.ts                      # monta /api/auth, /api/categories, /api/tasks
│   └── server.ts
├── .env                            # NO versionar (claves Clerk + DATABASE_URL)
├── package.json
└── tsconfig.json                   # paths @/* → ./src/* (sin baseUrl), noUncheckedIndexedAccess, exactOptionalPropertyTypes
```

Frontend (/client) — planificado, NO implementado
```
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
```

## Estado actual
- ✅ Backend base (Express ESM + Prisma + healthcheck)
- ✅ Auth con Clerk (@clerk/express v2, getAuth)
- ✅ Migraciones + seed + integridad de datos
- ✅ Módulo de categorías completo
- ✅ Módulo de tareas completo (filtros, subtasks, completedAt)
- ⏳ Métricas (dashboard/charts)
- ⏳ Frontend React (pendiente de iniciar)

## Reglas Inquebrantables
1. NO usar alert() ni console.log() en producción
2. Toda validación de inputs con Zod
3. Frontend: TanStack Query para server state, Zustand para UI state
4. shadcn/ui para toda la interfaz funcional
5. Backend: NUNCA acceder a req/res desde Services
6. Commits en git después de cada prompt exitoso
7. Backend ESM: imports relativos con extensión `.js` (`@/services/task.service.js`)
