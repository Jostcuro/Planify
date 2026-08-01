import { Component, type ReactNode } from 'react'

import ErrorState from '@/components/ui/error-state'

interface PageErrorBoundaryProps {
  children: ReactNode
}

interface PageErrorBoundaryState {
  hasError: boolean
}

export default class PageErrorBoundary extends Component<PageErrorBoundaryProps, PageErrorBoundaryState> {
  state: PageErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): PageErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center p-4">
          <ErrorState
            title="No se pudo cargar esta sección."
            description="Comprueba tu conexión e inténtalo de nuevo."
            onRetry={() => window.location.reload()}
          />
        </div>
      )
    }

    return this.props.children
  }
}
