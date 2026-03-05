import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface LegalPageProps {
  title: string
  content: string
}

export function LegalPage({ title, content }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="font-bold text-xl gradient-text">
            LifeOps
          </Link>
          <Link to="/">
            <Button variant="ghost">Back</Button>
          </Link>
        </div>
      </header>

      <main className="prose prose-neutral mx-auto max-w-3xl px-4 py-16 dark:prose-invert">
        <h1>{title}</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <div className="mt-8 whitespace-pre-wrap">{content}</div>
      </main>
    </div>
  )
}
