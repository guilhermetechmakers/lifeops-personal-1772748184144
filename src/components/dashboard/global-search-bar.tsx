/**
 * GlobalSearchBar - Cross-module search with debounced input
 * LifeOps Personal Dashboard
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, FolderKanban, FileText, Wallet, Heart, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useDashboardSearch } from '@/hooks/use-dashboard'
import type { SearchResult } from '@/types/dashboard'

const DEBOUNCE_MS = 300

const typeIcons: Record<SearchResult['type'], typeof FolderKanban> = {
  project: FolderKanban,
  content: FileText,
  finance: Wallet,
  health: Heart,
}

const typeLabels: Record<SearchResult['type'], string> = {
  project: 'Project',
  content: 'Content',
  finance: 'Finance',
  health: 'Health',
}

function getItemTitle(item: SearchResult['item']): string {
  if (item && typeof item === 'object' && 'title' in item) {
    return String((item as { title?: string }).title ?? '')
  }
  if (item && typeof item === 'object' && 'month' in item) {
    return String((item as { month?: string }).month ?? '')
  }
  if (item && typeof item === 'object' && 'metricName' in item) {
    return String((item as { metricName?: string }).metricName ?? '')
  }
  return ''
}

function getItemHref(result: SearchResult): string {
  const item = result.item
  if (!item || typeof item !== 'object' || !('id' in item)) return '#'
  const id = String((item as { id?: string }).id ?? '')
  switch (result.type) {
    case 'project':
      return `/dashboard/projects/${id}`
    case 'content':
      return `/dashboard/content/${id}`
    case 'finance':
      return '/dashboard/finance'
    case 'health':
      return '/dashboard/health'
    default:
      return '#'
  }
}

export interface GlobalSearchBarProps {
  className?: string
  onSelect?: () => void
}

export function GlobalSearchBar({ className, onSelect }: GlobalSearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { results, isSearching, search } = useDashboardSearch()

  const debouncedSearch = useCallback(
    (q: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        search(q)
        debounceRef.current = null
      }, DEBOUNCE_MS)
    },
    [search]
  )

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setQuery(v)
    if (v.trim()) {
      debouncedSearch(v)
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      setQuery('')
    }
  }

  const resultList = Array.isArray(results) ? results : []

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-md', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search projects, content, finance, health..."
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          className="pl-10 pr-10"
          aria-label="Search across modules"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && (query.trim() || resultList.length > 0) && (
        <div
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-xl border border-border bg-card shadow-card-hover animate-fade-in"
          role="listbox"
        >
          {resultList.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {isSearching ? 'Searching...' : 'No results found'}
            </div>
          ) : (
            <ul className="py-2">
              {resultList.map((r, i) => {
                const Icon = typeIcons[r.type]
                const title = getItemTitle(r.item)
                const href = getItemHref(r)
                return (
                  <li key={`${r.type}-${(r.item as { id?: string })?.id ?? i}`}>
                    <Link
                      to={href}
                      onClick={() => {
                        setIsOpen(false)
                        onSelect?.()
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-accent/50"
                      role="option"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{title || 'Untitled'}</p>
                        <p className="text-xs text-muted-foreground">{typeLabels[r.type]}</p>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
