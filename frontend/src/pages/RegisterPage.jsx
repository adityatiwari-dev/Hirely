import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

export function RegisterPage() {
  const navigate = useNavigate()
  const { api } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    try {
      const res = await api.register({ username, password })
      setMessage(typeof res === 'string' ? res : 'Registered.')
      setStatus('success')
      setTimeout(() => navigate('/login'), 700)
    } catch (err) {
      const msg = err?.response?.data || err?.message || 'Registration failed.'
      setMessage(typeof msg === 'string' ? msg : 'Registration failed.')
      setStatus('error')
    }
  }

  return (
    <div className="mx-auto grid max-w-lg gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-2 text-muted-foreground">
          This hits your backend `POST /register` (proxied through Vite to avoid CORS).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>You’ll be created as `ROLE_USER` by the backend.</CardDescription>
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
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {message ? (
              <div
                className={[
                  'rounded-md border px-3 py-2 text-sm',
                  status === 'success'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'border-destructive/40 bg-destructive/10 text-destructive',
                ].join(' ')}
              >
                {message}
              </div>
            ) : null}

            <Button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Creating…' : 'Create account'}
            </Button>

            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link className="font-medium text-foreground underline underline-offset-4" to="/login">
                Sign in
              </Link>
              .
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

