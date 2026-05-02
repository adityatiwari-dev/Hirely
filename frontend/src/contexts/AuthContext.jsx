/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { createApiClient } from '../api'

const AuthContext = createContext(null)

function toBasicAuthHeader(username, password) {
  if (!username || !password) return null
  const token = btoa(`${username}:${password}`)
  return `Basic ${token}`
}

export function AuthProvider({ children }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(null) // 'ROLE_USER' | 'ROLE_ADMIN' | null
  const [status, setStatus] = useState('anonymous') // anonymous | authenticating | authenticated

  const api = useMemo(() => {
    return createApiClient({
      getAuthHeader: () => toBasicAuthHeader(username, password),
    })
  }, [username, password])

  const login = async ({ username: u, password: p }) => {
    setStatus('authenticating')
    setUsername(u)
    setPassword(p)
    setRole(null)

    // Role probing:
    // Your backend does not expose a /me endpoint. We infer role by calling an endpoint
    // that only ROLE_USER can access. If it's forbidden but credentials are valid, we
    // treat the user as ROLE_ADMIN for UI gating.
    try {
      await createApiClient({
        getAuthHeader: () => toBasicAuthHeader(u, p),
      }).getMyApplications()
      setRole('ROLE_USER')
      setStatus('authenticated')
      return { ok: true, role: 'ROLE_USER' }
    } catch (err) {
      const httpStatus = err?.response?.status
      if (httpStatus === 403) {
        setRole('ROLE_ADMIN')
        setStatus('authenticated')
        return { ok: true, role: 'ROLE_ADMIN' }
      }
      if (httpStatus === 401) {
        setUsername('')
        setPassword('')
        setRole(null)
        setStatus('anonymous')
        return { ok: false, message: 'Invalid username or password.' }
      }

      setRole(null)
      setStatus('authenticated')
      return { ok: true, role: null, message: 'Logged in, but role could not be inferred.' }
    }
  }

  const logout = () => {
    setUsername('')
    setPassword('')
    setRole(null)
    setStatus('anonymous')
  }

  const value = useMemo(
    () => ({
      api,
      username,
      role,
      status,
      isAuthenticated: status === 'authenticated',
      login,
      logout,
    }),
    [api, username, role, status],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

