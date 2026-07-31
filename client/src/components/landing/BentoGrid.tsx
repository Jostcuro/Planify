import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface BentoGridProps {
  className?: string
  children?: ReactNode
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        'mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3',
        className,
      )}
    >
      {children}
    </div>
  )
}

interface BentoGridItemProps {
  className?: string
  title: string
  description: string
  header?: ReactNode
  icon?: ReactNode
  delay?: number
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
  delay = 0,
}: BentoGridItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-xl border bg-card p-4 transition duration-200 hover:shadow-lg',
        className,
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        {icon}
        <div className="mt-2 font-semibold text-foreground">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground">{description}</div>
      </div>
    </motion.div>
  )
}
