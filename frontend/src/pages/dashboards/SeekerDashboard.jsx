import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Briefcase, CheckCircle2, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { toErrorMessage } from '../../lib/errors'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'

export function SeekerDashboard() {
  const { api, username } = useAuth()
  const [jobs, setJobs] = useState([])
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [jobsData, appsData] = await Promise.all([api.getJobs(), api.getMyApplications()])
      setJobs(Array.isArray(jobsData) ? jobsData : [])
      setApps(Array.isArray(appsData) ? appsData : [])
    } catch (err) {
      setError(toErrorMessage(err, 'Failed to load dashboard data.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const appliedJobIds = useMemo(() => new Set(apps.map((a) => a.jobId)), [apps])
  const recentJobs = useMemo(() => [...jobs].sort((a, b) => (b?.id ?? 0) - (a?.id ?? 0)).slice(0, 6), [jobs])

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Job Seeker Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Track your applications and discover new roles.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button asChild>
            <Link to="/jobs">
              Browse jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Applications</CardTitle>
            <CardDescription>Jobs you’ve applied to</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{apps.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Openings</CardTitle>
            <CardDescription>Total jobs available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{jobs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status</CardTitle>
            <CardDescription>Connected to backend</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Basic Auth
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>Recent openings</CardTitle>
              <CardDescription>Quick picks from your latest jobs.</CardDescription>
            </div>
            <Briefcase className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-3 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg border bg-muted/40" />
              ))}
            </div>
          ) : recentJobs.length === 0 ? (
            <div className="rounded-xl border bg-muted/30 p-6">
              <div className="text-lg font-semibold tracking-tight">
                Ready for your next adventure{username ? `, ${username}` : ''}?
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                There are no jobs available right now. Check back soon or try again after an admin posts a new role.
              </p>
              <div className="mt-4">
                <Button asChild variant="secondary">
                  <Link to="/jobs">Browse jobs</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{job.title}</div>
                    <div className="truncate text-sm text-muted-foreground">{job.company}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {appliedJobIds.has(job.id) ? <Badge>Applied</Badge> : <Badge variant="outline">New</Badge>}
                    <Button asChild size="sm" variant="outline">
                      <Link to="/jobs">View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

