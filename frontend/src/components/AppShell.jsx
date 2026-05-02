import { BriefcaseBusiness, LogOut, ShieldCheck } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

function TopNavLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'text-sm font-medium text-muted-foreground hover:text-foreground transition-colors',
          isActive && 'text-foreground',
        )
      }
    >
      {children}
    </NavLink>
  )
}

export function AppShell({ children }) {
  const { isAuthenticated, username, role, logout } = useAuth()

  return (
    <div className="min-h-dvh bg-gradient-to-b from-background to-muted/25">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-muted">
              <BriefcaseBusiness className="h-5 w-5" />
            </span>
            <span className="text-base font-bold tracking-tight">
              <span className="text-primary">Hire</span>
              <span className="text-foreground/90">ly</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <TopNavLink to="/jobs">Jobs</TopNavLink>
            <TopNavLink to="/about">About</TopNavLink>
            {isAuthenticated && <TopNavLink to="/dashboard">Dashboard</TopNavLink>}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="hidden items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm md:flex">
                  <span className="text-muted-foreground">{username}</span>
                  {role === 'ROLE_ADMIN' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                      Seeker
                    </span>
                  )}
                </div>
                <Button variant="outline" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link to="/login">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
      <footer className="border-t bg-background/50">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground">
          Hirely • Spring Boot (Basic Auth) • React + Tailwind + shadcn-style UI
        </div>
      </footer>
    </div>
  )
}

