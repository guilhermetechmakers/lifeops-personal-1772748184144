/**
 * ExportModal - Downloadable CSV/JSON with selected fields. Privacy-preserving.
 */

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { exportUsers } from '@/api/admin'
import { toast } from 'sonner'
import type { User } from '@/types/admin'

const EXPORT_FIELDS = [
  { id: 'id', label: 'ID' },
  { id: 'username', label: 'Username' },
  { id: 'email', label: 'Email' },
  { id: 'status', label: 'Status' },
  { id: 'role', label: 'Role' },
  { id: 'region', label: 'Region' },
  { id: 'lastActiveAt', label: 'Last Active' },
  { id: 'createdAt', label: 'Created At' },
] as const

export interface ExportModalProps {
  users: User[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExportModal({ users, open, onOpenChange }: ExportModalProps) {
  const [format, setFormat] = useState<'csv' | 'json'>('csv')
  const [selectedFields, setSelectedFields] = useState<string[]>(
    EXPORT_FIELDS.map((f) => f.id)
  )
  const [isExporting, setIsExporting] = useState(false)

  const toggleField = (id: string) => {
    setSelectedFields((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  const handleExport = async () => {
    const userIds = (users ?? []).map((u) => u?.id).filter(Boolean) as string[]
    const fields = selectedFields.length > 0 ? selectedFields : ['id', 'username', 'email']
    setIsExporting(true)
    try {
      const blob = await exportUsers({
        userIds,
        fields,
        format,
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `admin-export-${Date.now()}.${format}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Export downloaded')
      onOpenChange(false)
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Export {users?.length ?? 0} user(s). Select fields to include. Only include
            necessary data for privacy.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Format</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  checked={format === 'csv'}
                  onChange={() => setFormat('csv')}
                  className="rounded-full"
                />
                CSV
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  checked={format === 'json'}
                  onChange={() => setFormat('json')}
                  className="rounded-full"
                />
                JSON
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Fields to export</Label>
            <div className="grid grid-cols-2 gap-2">
              {(EXPORT_FIELDS ?? []).map((f) => (
                <label
                  key={f.id}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <Checkbox
                    checked={selectedFields.includes(f.id)}
                    onCheckedChange={() => toggleField(f.id)}
                  />
                  {f.label}
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? 'Exporting...' : 'Download'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
