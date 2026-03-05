import { useState, useMemo, useCallback } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { filterTimezones } from '@/data/timezones'
import { cn } from '@/lib/utils'

export interface TimezoneSelectorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function TimezoneSelector({
  value,
  onChange,
  placeholder = 'Select timezone',
  className,
}: TimezoneSelectorProps) {
  const [search, setSearch] = useState('')
  const filtered = useMemo(
    () => filterTimezones(search),
    [search]
  )

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }, [])

  return (
    <div className={cn('space-y-2', className)}>
      <Input
        type="text"
        placeholder="Search timezones..."
        value={search}
        onChange={handleSearchChange}
        className="rounded-xl"
        aria-label="Search timezones"
      />
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger className="rounded-xl">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {(filtered ?? []).map((tz) => (
            <SelectItem key={tz} value={tz} className="rounded-lg">
              {tz}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
