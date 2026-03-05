import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ValidationMessage } from '@/components/profile/validation-message'
import { validateBio } from '@/utils/validation'
import { cn } from '@/lib/utils'

const BIO_MAX_LENGTH = 300

export interface BioEditorCardProps {
  bio: string
  onSave: (bio: string) => Promise<void>
  isSaving?: boolean
}

export function BioEditorCard({
  bio,
  onSave,
  isSaving = false,
}: BioEditorCardProps) {
  const [value, setValue] = useState(bio ?? '')
  const [error, setError] = useState<string | null>(null)

  const handleSave = useCallback(async () => {
    const err = validateBio(value)
    setError(err ?? null)
    if (err) return
    await onSave(value.trim())
  }, [value, onSave])

  const charCount = (value ?? '').length
  const isOverLimit = charCount > BIO_MAX_LENGTH

  return (
    <Card className="transition-all duration-200 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle>Bio</CardTitle>
        <CardDescription>A short description about yourself</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, BIO_MAX_LENGTH))}
            placeholder="Tell others about yourself..."
            maxLength={BIO_MAX_LENGTH}
            className={cn(
              'min-h-[100px] resize-none rounded-xl transition-colors',
              error && 'border-destructive focus-visible:ring-destructive'
            )}
            aria-invalid={!!error}
            aria-describedby={error ? 'bio-error' : 'bio-count'}
          />
          <div className="flex items-center justify-between">
            <div>
              {error && (
                <ValidationMessage
                  id="bio-error"
                  message={error}
                  type="error"
                />
              )}
            </div>
            <span
              id="bio-count"
              className={cn(
                'text-xs',
                isOverLimit ? 'text-destructive' : 'text-muted-foreground'
              )}
            >
              {charCount}/{BIO_MAX_LENGTH}
            </span>
          </div>
        </div>
        <Button
          onClick={() => void handleSave()}
          disabled={isSaving}
          className="gradient-primary transition-transform hover:scale-[1.02]"
        >
          {isSaving ? 'Saving...' : 'Save bio'}
        </Button>
      </CardContent>
    </Card>
  )
}
