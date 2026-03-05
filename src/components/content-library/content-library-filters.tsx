/**
 * ContentLibraryFilters - Status, channel, tags, date range, search
 */

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ContentFilters } from '@/types/content'

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'published', label: 'Published' },
]

const CHANNEL_OPTIONS = [
  { value: 'blog', label: 'Blog' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'youtube', label: 'YouTube' },
]

export interface ContentLibraryFiltersProps {
  filters: ContentFilters
  onFiltersChange: (filters: Partial<ContentFilters>) => void
  availableTags?: string[]
  searchPlaceholder?: string
  /** When provided, search is controlled externally (e.g. from page-level search input) */
  searchValue?: string
  onSearchChange?: (value: string) => void
  className?: string
}

export function ContentLibraryFilters({
  filters,
  onFiltersChange,
  availableTags = [],
  searchPlaceholder = 'Search content...',
  searchValue,
  onSearchChange,
  className,
}: ContentLibraryFiltersProps) {
  const tags = Array.isArray(availableTags) ? availableTags : []
  const selectedStatus = Array.isArray(filters?.status) ? filters.status : []
  const selectedChannel = Array.isArray(filters?.channel) ? filters.channel : []
  const selectedTags = Array.isArray(filters?.tags) ? filters.tags : []

  const searchVal = searchValue ?? filters?.query ?? ''
  const searchControlledExternally = searchValue !== undefined && onSearchChange !== undefined
  const hasActiveFilters =
    selectedStatus.length > 0 ||
    selectedChannel.length > 0 ||
    selectedTags.length > 0 ||
    (filters?.dateFrom ?? '').trim() !== '' ||
    (filters?.dateTo ?? '').trim() !== '' ||
    searchVal.trim() !== ''

  const toggleStatus = (value: string) => {
    const next = selectedStatus.includes(value)
      ? selectedStatus.filter((s) => s !== value)
      : [...selectedStatus, value]
    onFiltersChange({ status: next })
  }

  const toggleChannel = (value: string) => {
    const next = selectedChannel.includes(value)
      ? selectedChannel.filter((c) => c !== value)
      : [...selectedChannel, value]
    onFiltersChange({ channel: next })
  }

  const toggleTag = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag]
    onFiltersChange({ tags: next })
  }

  const resetFilters = () => {
    onFiltersChange({
      status: [],
      channel: [],
      tags: [],
      dateFrom: undefined,
      dateTo: undefined,
      query: undefined,
    })
    onSearchChange?.('')
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-border bg-card p-4',
        className
      )}
      role="group"
      aria-label="Filter content"
    >
      {!searchControlledExternally && (
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={filters?.query ?? ''}
            onChange={(e) => onFiltersChange({ query: e.target.value })}
            className="pl-10"
            aria-label="Search content"
          />
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleStatus(opt.value)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
                  selectedStatus.includes(opt.value)
                    ? 'gradient-primary text-primary-foreground shadow'
                    : 'border border-border bg-card text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
                aria-pressed={selectedStatus.includes(opt.value)}
                aria-label={`Filter by status ${opt.label}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Channel:</span>
          <div className="flex flex-wrap gap-1.5">
            {CHANNEL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleChannel(opt.value)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
                  selectedChannel.includes(opt.value)
                    ? 'gradient-primary text-primary-foreground shadow'
                    : 'border border-border bg-card text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
                aria-pressed={selectedChannel.includes(opt.value)}
                aria-label={`Filter by channel ${opt.label}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="date-from" className="text-sm text-muted-foreground">
            From:
          </label>
          <Input
            id="date-from"
            type="date"
            value={filters?.dateFrom ?? ''}
            onChange={(e) => onFiltersChange({ dateFrom: e.target.value || undefined })}
            className="w-[140px]"
            aria-label="Date from"
          />
          <label htmlFor="date-to" className="text-sm text-muted-foreground">
            To:
          </label>
          <Input
            id="date-to"
            type="date"
            value={filters?.dateTo ?? ''}
            onChange={(e) => onFiltersChange({ dateTo: e.target.value || undefined })}
            className="w-[140px]"
            aria-label="Date to"
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            aria-label="Reset all filters"
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Tags:</span>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
                  selectedTags.includes(tag)
                    ? 'gradient-primary text-primary-foreground shadow'
                    : 'border border-border bg-card text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
                aria-pressed={selectedTags.includes(tag)}
                aria-label={`Filter by tag ${tag}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
