import { Loader2 } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import PageErrorBoundary from '@/components/PageErrorBoundary'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'

const LandingPage = lazy(() => import('@/pages/LandingPage'))
const SignInPage = lazy(() => import('@/pages/SignInPage'))
const SignUpPage = lazy(() => import('@/pages/SignUpPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const CalendarPage = lazy(() => import('@/pages/CalendarPage'))
const MetricsPage = lazy(() => import('@/pages/MetricsPage'))

export default function App() {
  return (
    <PageErrorBoundary>
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="metrics" element={<MetricsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </PageErrorBoundary>
  )
}
