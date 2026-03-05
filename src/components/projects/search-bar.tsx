/**
 * SearchBar - Debounced search input for projects
 */

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search projects...',
  className,
}: SearchBarProps) {
  return (
    <div className={cn('relative flex-1', className)} role="search" aria-label="Search projects">
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target?.value ?? '')}
        className="pl-10"
        aria-label="Search by project name or keyword"
      />
    </div>
  )
}
