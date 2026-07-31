import { ArrowRight, ListChecks } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
      <span className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1 text-sm font-medium text-muted-foreground">
        <ListChecks className="size-4" />
        Planify — Gestor de tareas
      </span>
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
        Organiza tus tareas, cumple tus deadlines.
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        Categorías, prioridades, calendario y métricas en un solo lugar. La landing con
        Aceternity UI se integra en una tarea dedicada.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button asChild size="lg">
          <Link to="/dashboard">
            Ir al dashboard
            <ArrowRight />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/login">Iniciar sesión</Link>
        </Button>
      </div>
    </main>
  )
}
