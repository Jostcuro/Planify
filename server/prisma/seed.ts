import { TaskPriority, TaskStatus } from '@prisma/client'
import type { Prisma } from '@prisma/client'

import { disconnectPrisma, prisma } from '../src/config/db.js'

const DEMO_USER = {
  id: 'user_demo_123',
  email: 'demo@taskmanager.com',
  name: 'Demo User',
} as const

const DAY_IN_MS = 24 * 60 * 60 * 1000

const daysFromNow = (days: number): Date => new Date(Date.now() + days * DAY_IN_MS)
const laterToday = (): Date => new Date(Date.now() + 2 * 60 * 60 * 1000)

interface CategorySeed {
  name: string
  color: string
}

const CATEGORIES: CategorySeed[] = [
  { name: 'Trabajo', color: '#ef4444' },
  { name: 'Personal', color: '#3b82f6' },
  { name: 'Estudio', color: '#22c55e' },
]

interface SubtaskSeed {
  title: string
  completed: boolean
}

interface TaskSeed {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: Date
  completedAt?: Date
  categoryName: string
  subtasks: SubtaskSeed[]
}

const TASKS: TaskSeed[] = [
  {
    title: 'Investigar alternativas al pipeline de CI',
    description: 'Evaluar opciones y preparar una propuesta para el equipo.',
    status: TaskStatus.BACKLOG,
    priority: TaskPriority.LOW,
    dueDate: daysFromNow(14),
    categoryName: 'Trabajo',
    subtasks: [],
  },
  {
    title: 'Leer documentación de Prisma 5',
    description: 'Enfocarse en relaciones, transacciones y migraciones.',
    status: TaskStatus.BACKLOG,
    priority: TaskPriority.MEDIUM,
    dueDate: daysFromNow(21),
    categoryName: 'Estudio',
    subtasks: [],
  },
  {
    title: 'Configurar el linter del repositorio',
    description: 'Instalar ESLint y Prettier con reglas estrictas.',
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    dueDate: laterToday(),
    categoryName: 'Trabajo',
    subtasks: [
      { title: 'Definir reglas de ESLint', completed: false },
      { title: 'Añadir scripts de lint', completed: false },
      { title: 'Integrar Prettier con ESLint', completed: false },
    ],
  },
  {
    title: 'Planificar el viaje de fin de semana',
    description: 'Reservar alojamiento y actividades.',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: daysFromNow(5),
    categoryName: 'Personal',
    subtasks: [],
  },
  {
    title: 'Diseñar el dashboard de métricas',
    description: 'Definir los KPIs y las vistas del panel.',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    dueDate: laterToday(),
    categoryName: 'Trabajo',
    subtasks: [
      { title: 'Definir KPIs principales', completed: true },
      { title: 'Diseñar wireframes', completed: true },
      { title: 'Implementar endpoint de métricas', completed: false },
    ],
  },
  {
    title: 'Refactorizar los servicios del backend',
    description: 'Aplicar Clean Code en la capa de servicios.',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.URGENT,
    dueDate: daysFromNow(3),
    categoryName: 'Estudio',
    subtasks: [],
  },
  {
    title: 'Redactar el README del proyecto',
    description: 'Documentar instalación, scripts y arquitectura.',
    status: TaskStatus.IN_REVIEW,
    priority: TaskPriority.MEDIUM,
    dueDate: daysFromNow(-2),
    categoryName: 'Personal',
    subtasks: [
      { title: 'Sección de instalación', completed: true },
      { title: 'Sección de scripts', completed: true },
      { title: 'Sección de arquitectura', completed: true },
      { title: 'Revisión final y formato', completed: false },
    ],
  },
  {
    title: 'Revisar PR de integración de Clerk',
    description: 'Validar el flujo de autenticación y los middlewares.',
    status: TaskStatus.IN_REVIEW,
    priority: TaskPriority.HIGH,
    dueDate: daysFromNow(1),
    categoryName: 'Trabajo',
    subtasks: [],
  },
  {
    title: 'Configurar la migración inicial de BD',
    description: 'Crear el schema Prisma y aplicar la primera migración.',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.LOW,
    dueDate: daysFromNow(-7),
    completedAt: daysFromNow(-6),
    categoryName: 'Trabajo',
    subtasks: [],
  },
  {
    title: 'Crear la cuenta en Clerk',
    description: 'Registrar la aplicación y obtener las claves de API.',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.MEDIUM,
    dueDate: daysFromNow(-3),
    completedAt: daysFromNow(-3),
    categoryName: 'Personal',
    subtasks: [],
  },
  {
    title: 'Migrar el proyecto a Jest',
    description: 'Se descartó por la curva de configuración.',
    status: TaskStatus.CANCELLED,
    priority: TaskPriority.LOW,
    dueDate: daysFromNow(-5),
    categoryName: 'Estudio',
    subtasks: [],
  },
  {
    title: 'Implementar chat en tiempo real',
    description: 'Fuera del alcance del MVP actual.',
    status: TaskStatus.CANCELLED,
    priority: TaskPriority.URGENT,
    dueDate: daysFromNow(-10),
    categoryName: 'Trabajo',
    subtasks: [],
  },
]

const EXPECTED_SUBTASK_COUNT = TASKS.reduce((total, task) => total + task.subtasks.length, 0)

const EXPECTED_PRIORITY_COUNT: Record<TaskPriority, number> = {
  [TaskPriority.LOW]: 3,
  [TaskPriority.MEDIUM]: 4,
  [TaskPriority.HIGH]: 3,
  [TaskPriority.URGENT]: 2,
}

async function resetDemoData(tx: Prisma.TransactionClient): Promise<void> {
  const existing = await tx.user.findUnique({ where: { id: DEMO_USER.id } })

  if (existing) {
    await tx.user.delete({ where: { id: DEMO_USER.id } })
    console.log('[seed] Usuario demo encontrado: datos previos limpiados.')
  }
}

async function seedDemoData(): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await resetDemoData(tx)

    await tx.user.create({ data: { ...DEMO_USER } })
    console.log(`[seed] Usuario creado: ${DEMO_USER.name} (${DEMO_USER.email})`)

    const categoryIds = new Map<string, string>()
    for (const category of CATEGORIES) {
      const created = await tx.category.create({
        data: { name: category.name, color: category.color, userId: DEMO_USER.id },
      })
      categoryIds.set(category.name, created.id)
      console.log(`[seed] Categoría creada: ${created.name} (${created.color})`)
    }

    for (const task of TASKS) {
      const created = await tx.task.create({
        data: {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          completedAt: task.completedAt ?? null,
          userId: DEMO_USER.id,
          categoryId: categoryIds.get(task.categoryName) ?? null,
          subtasks: { create: task.subtasks },
        },
      })
      console.log(
        `[seed] Tarea creada: "${created.title}" [${created.status} / ${created.priority}]`,
      )
    }

    console.log(
      `[seed] ${TASKS.length} tareas y ${EXPECTED_SUBTASK_COUNT} subtareas creadas.`,
    )
  })
}

interface StatusSummaryRow {
  status: TaskStatus
  _count: { _all: number }
}

interface PrioritySummaryRow {
  priority: TaskPriority
  _count: { _all: number }
}

async function assertDataIntegrity(): Promise<void> {
  const byStatus: StatusSummaryRow[] = await prisma.task.groupBy({
    by: ['status'],
    where: { userId: DEMO_USER.id },
    _count: { _all: true },
  })
  const byPriority: PrioritySummaryRow[] = await prisma.task.groupBy({
    by: ['priority'],
    where: { userId: DEMO_USER.id },
    _count: { _all: true },
  })
  const categoryCount = await prisma.category.count({ where: { userId: DEMO_USER.id } })
  const subtaskCount = await prisma.subtask.count({
    where: { task: { userId: DEMO_USER.id } },
  })

  const statusCount = new Map(byStatus.map((row) => [row.status, row._count._all]))
  const priorityCount = new Map(byPriority.map((row) => [row.priority, row._count._all]))

  const tasksPerStatus = TASKS.length / Object.values(TaskStatus).length
  for (const status of Object.values(TaskStatus)) {
    const actual = statusCount.get(status) ?? 0
    if (actual !== tasksPerStatus) {
      throw new Error(
        `QA falló: se esperaban ${tasksPerStatus} tareas en estado ${status}, hay ${actual}`,
      )
    }
  }

  for (const [priority, expected] of Object.entries(EXPECTED_PRIORITY_COUNT)) {
    const actual = priorityCount.get(priority as TaskPriority) ?? 0
    if (actual !== expected) {
      throw new Error(
        `QA falló: se esperaban ${expected} tareas con prioridad ${priority}, hay ${actual}`,
      )
    }
  }

  if (categoryCount !== CATEGORIES.length) {
    throw new Error(
      `QA falló: se esperaban ${CATEGORIES.length} categorías, hay ${categoryCount}`,
    )
  }

  if (subtaskCount !== EXPECTED_SUBTASK_COUNT) {
    throw new Error(
      `QA falló: se esperaban ${EXPECTED_SUBTASK_COUNT} subtareas, hay ${subtaskCount}`,
    )
  }

  console.log('[seed] QA: todas las aserciones de datos pasaron.')
}

async function printSummary(): Promise<void> {
  const byStatus: StatusSummaryRow[] = await prisma.task.groupBy({
    by: ['status'],
    where: { userId: DEMO_USER.id },
    _count: { _all: true },
  })
  const byPriority: PrioritySummaryRow[] = await prisma.task.groupBy({
    by: ['priority'],
    where: { userId: DEMO_USER.id },
    _count: { _all: true },
  })
  const subtaskCount = await prisma.subtask.count({
    where: { task: { userId: DEMO_USER.id } },
  })

  console.log('[seed] Resumen por estado:')
  for (const row of byStatus.sort((a, b) => a.status.localeCompare(b.status))) {
    console.log(`[seed]   ${row.status}: ${row._count._all}`)
  }

  console.log('[seed] Resumen por prioridad:')
  for (const row of byPriority.sort((a, b) => a.priority.localeCompare(b.priority))) {
    console.log(`[seed]   ${row.priority}: ${row._count._all}`)
  }

  console.log(`[seed] Categorías: ${CATEGORIES.length} | Subtareas: ${subtaskCount}`)
}

async function seed(): Promise<void> {
  console.log('[seed] Iniciando seed de datos demo...')

  await seedDemoData()
  await assertDataIntegrity()
  await printSummary()

  console.log('[seed] Seed completado correctamente.')
}

seed()
  .catch((error: unknown) => {
    console.error('[seed] Error durante el seed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await disconnectPrisma()
  })
