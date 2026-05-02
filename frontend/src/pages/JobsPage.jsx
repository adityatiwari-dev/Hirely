import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { toErrorMessage } from '../lib/errors'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'

function formatSalary(salary) {
  if (salary == null) return '—'
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
      salary,
    )
  } catch {
    return `${salary}`
  }
}

export function JobsPage() {
  const { api, isAuthenticated, role } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [location, setLocation] = useState('')
  const [searching, setSearching] = useState(false)

  const canApply = isAuthenticated && role === 'ROLE_USER'

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.getJobs()
      setJobs(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(toErrorMessage(err, 'Failed to load jobs.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSearch = async (e) => {
    e.preventDefault()
    setSearching(true)
    setError('')
    try {
      if (!location.trim()) {
        await load()
        return
      }
      const data = await api.searchJobsByLocation(location.trim())
      setJobs(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(toErrorMessage(err, 'Search failed.'))
    } finally {
      setSearching(false)
    }
  }

  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => (b?.id ?? 0) - (a?.id ?? 0))
  }, [jobs])

  const apply = async (jobId) => {
    try {
      await api.applyToJob(jobId)
      alert('Applied successfully.')
    } catch (err) {
      const httpStatus = err?.response?.status
      if (httpStatus === 401) {
        alert('Please sign in to apply.')
        return
      }
      if (httpStatus === 403) {
        alert('Only ROLE_USER accounts can apply.')
        return
      }
      alert(toErrorMessage(err, 'Failed to apply.'))
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Explore jobs</h1>
          <p className="mt-2 text-muted-foreground">Browse and search openings from your backend.</p>
        </div>

        <form className="flex w-full max-w-xl items-center gap-2" onSubmit={onSearch}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search by location (e.g. Bangalore)"
            />
          </div>
          <Button type="submit" variant="secondary" disabled={searching}>
            {searching ? 'Searching…' : 'Search'}
          </Button>
          <Button type="button" variant="outline" onClick={load} disabled={loading}>
            Refresh
          </Button>
        </form>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl border bg-muted/40" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sortedJobs.map((job) => (
            <Card key={job.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="mt-1">{job.company}</CardDescription>
                  </div>
                  <Badge variant="outline">{job.location}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Salary</span>
                  <span className="font-medium">{formatSalary(job.salary)}</span>
                </div>
              </CardContent>
              <CardFooter className="justify-between gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Details</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{job.title}</DialogTitle>
                      <DialogDescription>
                        {job.company} • {job.location}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Job ID</span>
                        <span className="font-medium">{job.id}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Salary</span>
                        <span className="font-medium">{formatSalary(job.salary)}</span>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => apply(job.id)}
                        disabled={!canApply}
                        title={!canApply ? 'Sign in as a ROLE_USER account to apply' : undefined}
                      >
                        Apply
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={() => apply(job.id)}
                  disabled={!canApply}
                  title={!canApply ? 'Sign in as a ROLE_USER account to apply' : undefined}
                >
                  Apply
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

