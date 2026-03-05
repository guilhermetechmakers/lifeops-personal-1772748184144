/**
 * AdminUserSearchBar - Query input with debounce, filters (status, role, region).
 */

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AdminUserSearchBarProps {
  query: string
  status: string
  role: string
  region: string
  onQueryChange: (q: string) => void
  onStatusChange: (s: string) => void
  onRoleChange: (r: string) => void
  onRegionChange: (r: string) => void
  debounceMs?: number
  className?: string
}

export function AdminUserSearchBar({
  query,
  status,
  role,
  region,
  onQueryChange,
  onStatusChange,
  onRoleChange,
  onRegionChange,
  debounceMs = 300,
  className,
}: AdminUserSearchBarProps) {
  const [localQuery, setLocalQuery] = useState(query)

  useEffect(() => {
    setLocalQuery(query)
  }, [query])

  useEffect(() => {
    const t = setTimeout(() => onQueryChange(localQuery), debounceMs)
    return () => clearTimeout(t)
  }, [localQuery, debounceMs, onQueryChange])

  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-end', className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by username or email..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <Label className="text-xs">Status</Label>
          <Select value={status || 'all'} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Role</Label>
          <Select value={role || 'all'} onValueChange={onRoleChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Region</Label>
          <Select value={region || 'all'} onValueChange={onRegionChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="US">US</SelectItem>
              <SelectItem value="EU">EU</SelectItem>
              <SelectItem value="APAC">APAC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
