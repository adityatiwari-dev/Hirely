import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, status } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await login({ username, password })
    if (!res.ok) {
      setError(res.message || 'Login failed.')
      return
    }
    navigate('/dashboard')
  }

  const disabled = status === 'authenticating'

  return (
    <div className="mx-auto grid max-w-lg gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-muted-foreground">
          Sign in with your backend credentials (HTTP Basic). We don’t store tokens in localStorage.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Use your Spring Security username/password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. aditya"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error ? (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <Button type="submit" disabled={disabled}>
              {disabled ? 'Signing in…' : 'Sign in'}
            </Button>

            <p className="text-sm text-muted-foreground">
              New here?{' '}
              <Link className="font-medium text-foreground underline underline-offset-4" to="/register">
                Create an account
              </Link>
              .
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

