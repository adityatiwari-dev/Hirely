import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AdminDashboard } from './dashboards/AdminDashboard'
import { SeekerDashboard } from './dashboards/SeekerDashboard'

export function DashboardPage() {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (role === 'ROLE_ADMIN') return <AdminDashboard />
  return <SeekerDashboard />
}

