import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export function AboutPage() {
  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight">About Hirely</h1>
          <p className="mt-3 text-muted-foreground">
            Hirely is a human-centric job portal built to keep hiring simple: fast discovery for job seekers, and clean
            workflows for employers.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link to="/jobs">Explore jobs</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/dashboard">Go to dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Built by</CardTitle>
          <CardDescription>Creator details</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex flex-col gap-1">
            <div className="text-lg font-semibold tracking-tight">Aditya Tiwari</div>
            <div className="text-sm text-muted-foreground">Full-Stack Developer</div>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Email:</span>{' '}
            <a
              className="font-medium text-foreground underline underline-offset-4"
              href="mailto:tiwariadi1709@gmail.com"
            >
              tiwariadi1709@gmail.com
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            Building Hirely with a focus on clean UI, thoughtful UX, and simple workflows that help people find their next
            opportunity.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Human-centric</CardTitle>
            <CardDescription>Designed for clarity</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Friendly empty states, generous whitespace, and rounded surfaces that feel calm and modern.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Role-based</CardTitle>
            <CardDescription>Right tools for the role</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Job seekers can apply and track applications. Admins can post jobs and review incoming applicants.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Built on your backend</CardTitle>
            <CardDescription>Simple, transparent integration</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            React UI mapped to your Spring Boot endpoints using Axios and HTTP Basic authentication.
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What’s next</CardTitle>
          <CardDescription>Easy upgrades when you’re ready</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground">
          <div>- Add a “My Profile” page and a `/me` backend endpoint for first-class role detection.</div>
          <div>- Add employer-specific jobs and applications filtered per employer.</div>
          <div>- Add email notifications on new applications.</div>
        </CardContent>
      </Card>
    </div>
  )
}

