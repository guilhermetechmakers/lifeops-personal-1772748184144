/**
 * PermissionsPanel - Add/remove collaborators, invite by email, show status (pending, accepted)
 */

import { useState } from 'react'
import { UserPlus, Mail, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { isValidEmail } from '@/utils/validation-project'
import type { Collaborator, PendingCollaborator } from '@/types/create-edit-project'

export interface PermissionsPanelProps {
  collaborators: (Collaborator | PendingCollaborator)[]
  onAdd: (email: string, role: string) => void
  onRemove: (id: string) => void
  onInvite?: (email: string, role: string) => void | Promise<void>
}

const ROLE_OPTIONS = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'editor', label: 'Editor' },
  { value: 'admin', label: 'Admin' },
]

export function PermissionsPanel({
  collaborators = [],
  onAdd,
  onRemove,
  onInvite,
}: PermissionsPanelProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('editor')
  const [error, setError] = useState<string | null>(null)

  const list = Array.isArray(collaborators) ? collaborators : (collaborators ?? [])

  const handleAdd = () => {
    setError(null)
    const trimmed = email?.trim()
    if (!trimmed) {
      setError('Email is required')
      return
    }
    if (!isValidEmail(trimmed)) {
      setError('Please enter a valid email address')
      return
    }
    if (list.some((c) => (c.email ?? '').toLowerCase() === trimmed.toLowerCase())) {
      setError('This collaborator is already added')
      return
    }
    onAdd(trimmed, role)
    setEmail('')
    setRole('editor')
  }

  const handleInvite = async () => {
    if (!onInvite) return
    setError(null)
    const trimmed = email?.trim()
    if (!trimmed || !isValidEmail(trimmed)) {
      setError('Please enter a valid email address')
      return
    }
    await onInvite(trimmed, role)
    setEmail('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Collaborators
        </CardTitle>
        <CardDescription>
          Invite team members by email and assign roles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="collab-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="collab-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                }}
                placeholder="colleague@example.com"
                className="pl-9"
                aria-invalid={!!error}
                aria-describedby={error ? 'collab-error' : undefined}
              />
            </div>
          </div>
          <div className="w-full space-y-2 sm:w-40">
            <Label htmlFor="collab-role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="collab-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="default"
              onClick={handleAdd}
              aria-label="Add collaborator"
            >
              Add
            </Button>
            {onInvite && (
              <Button
                size="default"
                className="gradient-primary text-primary-foreground"
                onClick={handleInvite}
                aria-label="Send invite"
              >
                Invite
              </Button>
            )}
          </div>
        </div>
        {error && (
          <p id="collab-error" className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {list.length > 0 ? (
          <ul className="space-y-2">
            {list.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
              >
                <div>
                  <p className="font-medium">{c.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.role} • {'acceptedAt' in c && c.acceptedAt ? 'Accepted' : 'Pending'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => onRemove(c.id)}
                  aria-label={`Remove ${c.email}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No collaborators yet. Add emails above to invite.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
