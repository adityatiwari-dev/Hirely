import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { toErrorMessage } from '../../lib/errors'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'

function JobForm({ initial, onSubmit, submitting, submitLabel }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [company, setCompany] = useState(initial?.company || '')
  const [location, setLocation] = useState(initial?.location || '')
  const [salary, setSalary] = useState(initial?.salary ?? '')

  const handle = (e) => {
    e.preventDefault()
    const parsedSalary = salary === '' ? null : Number(salary)
    onSubmit({
      title,
      company,
      location,
      salary: parsedSalary == null || Number.isNaN(parsedSalary) ? 0 : parsedSalary,
    })
  }

  return (
    <form className="grid gap-4" onSubmit={handle}>
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="company">Company</Label>
        <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="salary">Salary</Label>
        <Input
          id="salary"
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="e.g. 120000"
          required
        />
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Saving…' : submitLabel}
      </Button>
    </form>
  )
}

export function AdminDashboard() {
  const { api, role } = useAuth()
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedJobId, setSelectedJobId] = useState('all')
  const applicationsRef = useRef(null)

  const [creating, setCreating] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const canPost = role === 'ROLE_ADMIN'

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [jobsData, appsData] = await Promise.all([
        api.getJobs(),
        canPost ? api.getAllApplicationsAdmin() : Promise.resolve([]),
      ])
      setJobs(Array.isArray(jobsData) ? jobsData : [])
      setApplications(Array.isArray(appsData) ? appsData : [])
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

  const sortedJobs = useMemo(() => [...jobs].sort((a, b) => (b?.id ?? 0) - (a?.id ?? 0)), [jobs])
  const sortedApplications = useMemo(
    () => [...applications].sort((a, b) => (b?.id ?? 0) - (a?.id ?? 0)),
    [applications],
  )
  const filteredApplications = useMemo(() => {
    if (selectedJobId === 'all') return sortedApplications
    const id = Number(selectedJobId)
    if (Number.isNaN(id)) return sortedApplications
    return sortedApplications.filter((a) => a.jobId === id)
  }, [sortedApplications, selectedJobId])

  const createJob = async (job) => {
    setCreating(true)
    setError('')
    try {
      await api.createJob(job)
      await load()
    } catch (err) {
      setError(toErrorMessage(err, 'Failed to create job.'))
    } finally {
      setCreating(false)
    }
  }

  const updateJob = async (id, job) => {
    setUpdatingId(id)
    setError('')
    try {
      await api.updateJob(id, job)
      await load()
    } catch (err) {
      setError(toErrorMessage(err, 'Failed to update job.'))
    } finally {
      setUpdatingId(null)
    }
  }

  const deleteJob = async (id) => {
    setDeletingId(id)
    setError('')
    try {
      await api.deleteJob(id)
      await load()
    } catch (err) {
      setError(toErrorMessage(err, 'Failed to delete job.'))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Employer/Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Create and manage job openings for candidates.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>

          {canPost ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4" />
                  Post a Job
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Post a Job</DialogTitle>
                </DialogHeader>
                <JobForm initial={null} onSubmit={createJob} submitting={creating} submitLabel="Create job" />
                <DialogFooter />
              </DialogContent>
            </Dialog>
          ) : null}
        </div>
      </div>

      {canPost ? null : (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          You’re signed in, but not as `ROLE_ADMIN`, so posting is hidden.
        </div>
      )}

      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {canPost ? (
        <Card>
          <CardHeader ref={applicationsRef}>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Incoming applications</CardTitle>
                <CardDescription>Filter by job to review applicants.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label className="sr-only" htmlFor="jobFilter">
                  Filter by job
                </Label>
                <select
                  id="jobFilter"
                  className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                >
                  <option value="all">All jobs</option>
                  {sortedJobs.map((j) => (
                    <option key={j.id} value={String(j.id)}>
                      #{j.id} • {j.title}
                    </option>
                  ))}
                </select>
                <Badge variant="outline">{filteredApplications.length}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid gap-3 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 animate-pulse rounded-xl border bg-muted/40" />
                ))}
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="rounded-xl border bg-muted/30 p-6">
                <div className="text-lg font-semibold tracking-tight">No applications yet</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {selectedJobId === 'all'
                    ? 'Once job seekers apply, their applications will appear here automatically.'
                    : 'No one has applied for this job yet. Try selecting another job.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {filteredApplications.map((app) => (
                  <div key={app.id} className="rounded-xl border bg-background p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-semibold">{app.username}</div>
                        <div className="mt-1 truncate text-sm text-muted-foreground">
                          Applied for {app.jobTitle || `Job #${app.jobId}`}
                        </div>
                        <div className="mt-1 truncate text-xs text-muted-foreground">
                          {app.jobCompany ? `${app.jobCompany} • ` : ''}
                          {app.jobLocation || '—'}
                        </div>
                      </div>
                      <div className="shrink-0 text-xs text-muted-foreground">#{app.id}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
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
            <Card key={job.id}>
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
                <div className="text-sm text-muted-foreground">Job ID: {job.id}</div>
              </CardContent>
              <CardFooter className="justify-between gap-2">
                <Button
                  variant="secondary"
                  disabled={!canPost}
                  onClick={() => {
                    setSelectedJobId(String(job.id))
                    applicationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                >
                  View applications
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" disabled={!canPost || updatingId === job.id}>
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit job</DialogTitle>
                    </DialogHeader>
                    <JobForm
                      initial={job}
                      onSubmit={(payload) => updateJob(job.id, payload)}
                      submitting={updatingId === job.id}
                      submitLabel="Save changes"
                    />
                    <DialogFooter />
                  </DialogContent>
                </Dialog>

                <Button
                  variant="destructive"
                  onClick={() => deleteJob(job.id)}
                  disabled={!canPost || deletingId === job.id}
                >
                  <Trash2 className="h-4 w-4" />
                  {deletingId === job.id ? 'Deleting…' : 'Delete'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

