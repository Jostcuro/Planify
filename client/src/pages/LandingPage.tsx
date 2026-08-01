import { ArrowRight, BarChart3, CalendarDays, Columns3, Tags } from 'lucide-react'
import { Link } from 'react-router-dom'

import { BentoGrid, BentoGridItem } from '@/components/landing/BentoGrid'
import { GridBackground } from '@/components/landing/GridBackground'
import { Spotlight } from '@/components/landing/Spotlight'
import { TextGenerateEffect } from '@/components/landing/TextGenerateEffect'
import { Button } from '@/components/ui/button'

const FEATURES = [
  {
    title: 'Gestión Kanban',
    description: 'Mueve tus tareas entre Backlog, Por hacer, En progreso y Completada para visualizar tu flujo de trabajo.',
    icon: Columns3,
    headerClass: 'bg-blue-100 text-blue-700',
    className: 'md:col-span-2',
    delay: 0,
  },
  {
    title: 'Análisis de productividad',
    description: 'Métricas claras: tasa de completado, tareas por estado y prioridad, y actividad de los últimos 7 días.',
    icon: BarChart3,
    headerClass: 'bg-emerald-100 text-emerald-700',
    className: '',
    delay: 0.1,
  },
  {
    title: 'Calendario integrado',
    description: 'Tu agenda de deadlines en un vistazo mensual, con las vencidas resaltadas y sin perder las tareas sin fecha.',
    icon: CalendarDays,
    headerClass: 'bg-violet-100 text-violet-700',
    className: '',
    delay: 0.15,
  },
  {
    title: 'Organización por categorías',
    description: 'Agrupa y filtra tus tareas por categorías con colores, prioridad y fechas límite para enfocarte en lo importante.',
    icon: Tags,
    headerClass: 'bg-amber-100 text-amber-700',
    className: 'md:col-span-2',
    delay: 0.2,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-24 text-center">
        <GridBackground />
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(2,6,23,0.9)_90%)]" />

        <div className="relative z-10 flex flex-col items-center gap-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-medium text-slate-300 backdrop-blur">
            <img src="/images/dragon-50.png" alt="Planify" className="size-4" style={{ filter: 'brightness(0) invert(1)' }} />
            Planify — Gestor de tareas
          </span>

          <TextGenerateEffect
            words="Organiza tus tareas, cumple tus deadlines."
            className="max-w-3xl bg-gradient-to-b from-white to-white/60 bg-clip-text text-4xl text-transparent sm:text-6xl"
          />

          <p className="max-w-xl text-lg text-slate-400">
            Categorías, prioridades, calendario y métricas en un solo lugar. Planifica tu día y
            deja que la productividad hable por ti.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-slate-950 hover:bg-slate-200">
              <Link to="/login">
                Comenzar Gratis
                <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/dashboard">Ver Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Todo lo que necesitas para ser productivo</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Un gestor de tareas completo con una experiencia limpia y enfocada.
          </p>
        </div>
        <div className="mt-12">
          <BentoGrid>
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <BentoGridItem
                  key={feature.title}
                  title={feature.title}
                  description={feature.description}
                  className={feature.className}
                  delay={feature.delay}
                  icon={
                    <span
                      className={`inline-flex size-10 items-center justify-center rounded-lg ${feature.headerClass}`}
                    >
                      <Icon className="size-5" />
                    </span>
                  }
                />
              )
            })}
          </BentoGrid>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Planify. Hecho con foco en la productividad.</p>
      </footer>
    </div>
  )
}
