/**
 * SearchAndFilterBar - Search input and filter controls for history
 */

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { HistoryItemType, HistoryFilters } from '@/types/history'

const FILTER_TYPES: { value: HistoryItemType; label: string }[] = [
  { value: 'invoice', label: 'Invoices' },
  { value: 'receipt', label: 'Receipts' },
  { value: 'refund', label: 'Refunds' },
  { value: 'subscription', label: 'Subscriptions' },
]

const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Newest first' },
  { value: 'date_asc', label: 'Oldest first' },
  { value: 'amount_desc', label: 'Amount high to low' },
  { value: 'amount_asc', label: 'Amount low to high' },
] as const

export interface SearchAndFilterBarProps {
  filters: HistoryFilters
  onFiltersChange: (filters: Partial<HistoryFilters>) => void
}

export function SearchAndFilterBar({
  filters,
  onFiltersChange,
}: SearchAndFilterBarProps) {
  const selectedTypes = Array.isArray(filters?.types) ? filters.types : []
  const search = filters?.search ?? ''
  const sort = filters?.sort ?? 'date_desc'

  const toggleType = (type: HistoryItemType) => {
    const next = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type]
    onFiltersChange({ types: next })
  }

  return (
    <div
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4"
      role="search"
      aria-label="Filter transaction history"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by invoice number, plan name..."
            value={search}
            onChange={(e) =>
              onFiltersChange({ search: e.target?.value ?? '' })
            }
            className="pl-9"
            aria-label="Search transactions"
          />
        </div>
        <Select
          value={sort}
          onValueChange={(v) =>
            onFiltersChange({ sort: v as HistoryFilters['sort'] })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Type:</span>
        <button
          type="button"
          onClick={() => onFiltersChange({ types: [] })}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
            selectedTypes.length === 0
              ? 'gradient-primary text-primary-foreground shadow'
              : 'border border-border bg-card text-muted-foreground hover:bg-accent/50 hover:text-foreground'
          )}
          aria-pressed={selectedTypes.length === 0}
          aria-label="Show all types"
        >
          All
        </button>
        {FILTER_TYPES.map(({ value, label }) => {
          const isActive =
            selectedTypes.length === 0 || selectedTypes.includes(value)
          return (
            <button
              key={value}
              type="button"
              onClick={() => toggleType(value)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
                selectedTypes.includes(value)
                  ? 'gradient-primary text-primary-foreground shadow'
                  : 'border border-border bg-card text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                !isActive && 'opacity-50'
              )}
              aria-pressed={selectedTypes.includes(value)}
              aria-label={`Filter by ${label}`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
