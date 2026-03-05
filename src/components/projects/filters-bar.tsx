/**
 * FiltersBar - Status, tags, due date, priority filters with reset
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProjectFilters, NextMilestoneFilter } from '@/types/projects'
import { DEFAULT_PROJECT_FILTERS } from '@/types/projects'

const STATUS_OPTIONS: { value: ProjectFilters['status']; label: string }[] = [
  { value: 'All', label: 'All' },
  { value: 'Planning', label: 'Planning' },
  { value: 'Active', label: 'Active' },
  { value: 'On Hold', label: 'On Hold' },
  { value: 'Paused', label: 'Paused' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
  { value: 'Archived', label: 'Archived' },
]

const DUE_DATE_PRESETS: { value: ProjectFilters['dueDatePreset']; label: string }[] = [
  { value: 'all', label: 'All dates' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'this_week', label: 'Due this week' },
  { value: 'this_month', label: 'Due this month' },
]

const PRIORITY_OPTIONS: { value: ProjectFilters['priority']; label: string }[] = [
  { value: 'All', label: 'All priorities' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
]

const NEXT_MILESTONE_OPTIONS: { value: NextMilestoneFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'has_milestone', label: 'Has next milestone' },
  { value: 'due_this_week', label: 'Due this week' },
  { value: 'overdue', label: 'Overdue' },
]

export interface FiltersBarProps {
  filters: ProjectFilters
  onFiltersChange: (filters: Partial<ProjectFilters>) => void
  availableTags?: string[]
  className?: string
}

export function FiltersBar({
  filters,
  onFiltersChange,
  availableTags = [],
  className,
}: FiltersBarProps) {
  const tags = Array.isArray(availableTags) ? availableTags : []
  const selectedTags = Array.isArray(filters?.tags) ? filters.tags : []
  const hasActiveFilters =
    filters?.status !== 'All' ||
    filters?.dueDatePreset !== 'all' ||
    filters?.priority !== 'All' ||
    (filters?.nextMilestone ?? 'all') !== 'all' ||
    selectedTags.length > 0 ||
    filters?.aiRecommendationsOnly === true

  const toggleTag = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag]
    onFiltersChange({ tags: next })
  }

  const resetFilters = () => {
    onFiltersChange(DEFAULT_PROJECT_FILTERS)
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-border bg-card p-4',
        className
      )}
      role="group"
      aria-label="Filter projects"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
        <Select
          value={filters?.status ?? 'All'}
          onValueChange={(v) => onFiltersChange({ status: v as ProjectFilters['status'] })}
        >
          <SelectTrigger className="w-full sm:w-[140px]" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters?.dueDatePreset ?? 'all'}
          onValueChange={(v) => onFiltersChange({ dueDatePreset: v as ProjectFilters['dueDatePreset'] })}
        >
          <SelectTrigger className="w-full sm:w-[160px]" aria-label="Filter by due date">
            <SelectValue placeholder="Due date" />
          </SelectTrigger>
          <SelectContent>
            {DUE_DATE_PRESETS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters?.priority ?? 'All'}
          onValueChange={(v) => onFiltersChange({ priority: v as ProjectFilters['priority'] })}
        >
          <SelectTrigger className="w-full sm:w-[150px]" aria-label="Filter by priority">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters?.nextMilestone ?? 'all'}
          onValueChange={(v) => onFiltersChange({ nextMilestone: v as NextMilestoneFilter })}
        >
          <SelectTrigger className="w-full sm:w-[160px]" aria-label="Filter by next milestone">
            <SelectValue placeholder="Next milestone" />
          </SelectTrigger>
          <SelectContent>
            {NEXT_MILESTONE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          type="button"
          onClick={() => onFiltersChange({ aiRecommendationsOnly: !filters?.aiRecommendationsOnly })}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
            filters?.aiRecommendationsOnly
              ? 'gradient-primary text-primary-foreground shadow'
              : 'border border-border bg-card text-muted-foreground hover:bg-accent/50 hover:text-foreground'
          )}
          aria-pressed={filters?.aiRecommendationsOnly}
          aria-label="Filter by AI recommendations"
        >
          AI recommendations
        </button>

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
          <button
            type="button"
            onClick={() => onFiltersChange({ tags: [] })}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
              selectedTags.length === 0
                ? 'gradient-primary text-primary-foreground shadow'
                : 'border border-border bg-card text-muted-foreground hover:bg-accent/50 hover:text-foreground'
            )}
            aria-pressed={selectedTags.length === 0}
            aria-label="Show all tags"
          >
            All
          </button>
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
      )}
    </div>
  )
}
