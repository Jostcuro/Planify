import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import SkeletonKanban from '@/components/ui/skeleton-kanban'
import SkeletonTable from '@/components/ui/skeleton-table'
import { ALL_STATUSES } from '@/lib/format'

describe('SkeletonTable', () => {
  it('renderiza el número de cards por defecto', () => {
    const { container } = render(<SkeletonTable />)

    expect(container.querySelectorAll('[data-testid="skeleton-card"]')).toHaveLength(4)
  })

  it('respeta la prop rows', () => {
    const { container } = render(<SkeletonTable rows={2} />)

    expect(container.querySelectorAll('[data-testid="skeleton-card"]')).toHaveLength(2)
  })
})

describe('SkeletonKanban', () => {
  it('renderiza una columna por cada estado', () => {
    const { container } = render(<SkeletonKanban />)

    expect(container.querySelectorAll('[data-testid="skeleton-column"]')).toHaveLength(
      ALL_STATUSES.length,
    )
  })
})
