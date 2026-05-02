import { useMemo } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { useAuth } from './contexts/AuthContext'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { JobsPage } from './pages/JobsPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { AboutPage } from './pages/AboutPage'

function HomePage() {
  const { isAuthenticated } = useAuth()

  const next = useMemo(() => {
    if (isAuthenticated) return '/dashboard'
    return '/jobs'
  }, [isAuthenticated])

  return (
    <div className="grid gap-10">
      <section className="relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(900px_circle_at_15%_15%,hsl(var(--primary)/0.18),transparent_45%),radial-gradient(900px_circle_at_85%_35%,hsl(var(--ring)/0.10),transparent_40%)]" />
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Find work you’ll love.
              <span className="text-primary"> Hire smarter.</span>
            </h1>
            <p className="mt-4 text-muted-foreground">
              Hirely helps job seekers discover their next opportunity and helps employers manage postings and incoming
              applications—without the clutter.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link to={next}>Get started</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/jobs">Browse jobs</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/about">About Hirely</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                Trustworthy blue UI
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Friendly, human-centric UX
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="bg-background/60">
              <CardHeader>
                <CardTitle className="text-base">For job seekers</CardTitle>
                <CardDescription>Apply with confidence</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Search roles by location, apply in one click, and track your applications from your dashboard.
              </CardContent>
            </Card>
            <Card className="bg-background/60">
              <CardHeader>
                <CardTitle className="text-base">For employers</CardTitle>
                <CardDescription>Review applicants fast</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Post jobs, edit listings, and view incoming applications—filterable by job.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div />
    </div>
  )
}

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
