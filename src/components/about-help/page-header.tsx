import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  className?: string
}

export function PageHeader({
  title,
  description,
  breadcrumbs = [],
  className,
}: PageHeaderProps) {
  const items = Array.isArray(breadcrumbs) ? breadcrumbs : []

  return (
    <header className={cn('space-y-2', className)}>
      {items.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
              {item.href ? (
                <Link to={item.href} className="hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {description && (
        <p className="max-w-2xl text-muted-foreground text-lg">{description}</p>
      )}
    </header>
  )
}
