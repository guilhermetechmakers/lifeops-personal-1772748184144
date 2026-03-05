import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  FolderKanban,
  FileText,
  Wallet,
  Heart,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react'

const features = [
  {
    icon: FolderKanban,
    title: 'Projects',
    description: 'AI-assisted project planning with milestones, Kanban boards, and smart task breakdowns.',
  },
  {
    icon: FileText,
    title: 'Content',
    description: 'Create, schedule, and publish content across channels with AI ideation and SEO tools.',
  },
  {
    icon: Wallet,
    title: 'Finance',
    description: 'Track spending, forecast cashflow, and get anomaly alerts with explainable AI insights.',
  },
  {
    icon: Heart,
    title: 'Health',
    description: 'Training plans, meal prep, and wearable integration—all in one wellness dashboard.',
  },
]

const benefits = [
  { icon: Sparkles, text: 'Explainable AI—every suggestion comes with a clear rationale' },
  { icon: Shield, text: 'Permission-first—agents suggest, you approve before any action' },
  { icon: Zap, text: 'Cross-domain automation—projects, content, finance, health in sync' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-full w-full bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-60" />
        <div className="absolute -bottom-1/2 -right-1/2 h-full w-full bg-gradient-to-tl from-primary/5 via-transparent to-transparent opacity-60" />
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="font-bold text-xl gradient-text">
            LifeOps
          </Link>
          <nav className="flex items-center gap-4">
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

      {/* Hero */}
      <section className="relative px-4 py-20 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="animate-fade-in-up text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Your life,{' '}
            <span className="gradient-text">orchestrated by AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground animate-fade-in-up [animation-delay:100ms]">
            Projects, content, finance, and health—unified in one intelligent OS.
            Permissioned agents suggest and act with full explainability. Reclaim control.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up [animation-delay:200ms]">
            <Link to="/signup">
              <Button size="lg" className="gradient-primary text-primary-foreground text-base px-8">
                Start Free
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features - Bento-style grid */}
      <section className="border-t border-border bg-card/50 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            One OS for your whole life
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Four modules, one orchestration layer. AI that explains itself and asks before acting.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="animate-fade-in-up rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:shadow-card-hover [animation-delay:150ms]"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="rounded-xl bg-primary/10 p-3 w-fit">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.text}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6"
              >
                <div className="rounded-lg bg-primary/10 p-2">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="font-medium">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-gradient-to-br from-primary/20 to-primary/5 p-12 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to reclaim control?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join thousands who've unified their life with LifeOps.
          </p>
          <Link to="/signup" className="mt-8 inline-block">
            <Button size="lg" className="gradient-primary text-primary-foreground">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LifeOps Personal
          </span>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link to="/about-help" className="text-sm text-muted-foreground hover:text-foreground">
              Help
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
