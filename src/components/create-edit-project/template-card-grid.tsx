/**
 * TemplateCardGrid - Responsive grid of template cards with preview and Apply button
 * Guard: ensure templates is an array; handle null data safely
 */

import { useState } from 'react'
import { Check, Eye, Layout } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { ProjectTemplate } from '@/types/create-edit-project'

export interface TemplateCardGridProps {
  templates?: ProjectTemplate[] | null
  onApply: (templateId: string) => void
  appliedTemplateId?: string | null
}

export function TemplateCardGrid({
  templates,
  onApply,
  appliedTemplateId,
}: TemplateCardGridProps) {
  const [previewTemplate, setPreviewTemplate] = useState<ProjectTemplate | null>(null)

  const list = Array.isArray(templates) ? templates : (templates ?? [])

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {list.map((t) => {
          const isApplied = appliedTemplateId === t.id
          return (
            <Card
              key={t.id}
              className={cn(
                'group overflow-hidden transition-all duration-200',
                isApplied && 'ring-2 ring-primary'
              )}
            >
              <div className="flex h-24 items-center justify-center bg-muted/50">
                <Layout className="h-10 w-10 text-muted-foreground" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                  {t.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setPreviewTemplate(t)}
                  aria-label={`Preview ${t.name}`}
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  className={cn(
                    'flex-1 transition-all duration-200 hover:scale-[1.02]',
                    isApplied ? 'bg-primary/80' : 'gradient-primary text-primary-foreground'
                  )}
                  onClick={() => onApply(t.id)}
                  aria-label={`Apply ${t.name} template`}
                >
                  {isApplied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Applied
                    </>
                  ) : (
                    'Apply'
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
            <DialogDescription>{previewTemplate?.description}</DialogDescription>
          </DialogHeader>
          {previewTemplate?.defaultMetadata && (
            <div className="space-y-2 text-sm">
              <p className="font-medium text-muted-foreground">Default fields</p>
              <p>Title: {previewTemplate.defaultMetadata.title ?? '—'}</p>
              <p>Tags: {(previewTemplate.defaultMetadata.tags ?? []).join(', ') || '—'}</p>
              <p>Priority: {previewTemplate.defaultMetadata.priority ?? '—'}</p>
            </div>
          )}
          <Button
            className="w-full gradient-primary text-primary-foreground"
            onClick={() => {
              if (previewTemplate) {
                onApply(previewTemplate.id)
                setPreviewTemplate(null)
              }
            }}
          >
            Apply template
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
