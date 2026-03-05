import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="font-bold text-xl gradient-text">
            LifeOps
          </Link>
          <nav className="flex gap-4">
            <Link to="/about-help" className="text-sm font-medium">
              Help
            </Link>
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button className="gradient-primary text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-3xl font-bold sm:text-4xl">About LifeOps</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          LifeOps Personal is a modular AI operating system that consolidates project planning,
          content creation, personal finance, and health management into one intelligent application.
        </p>

        <div className="mt-12 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge base</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                  Browse our guides and documentation to get the most out of LifeOps.
                </p>
              <Link to="/about-help">
                <Button variant="outline" className="mt-4">Browse guides</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                  Common questions and answers about LifeOps features and billing.
                </p>
              <Link to="/about-help#faq">
                <Button variant="outline" className="mt-4">View FAQ</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact support</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                  Need help? Reach out to our support team.
                </p>
              <Link to="/about-help#support">
                <Button variant="outline" className="mt-4">Contact form</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
