import { CheckCircle2, Circle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Guide } from '@/types/about-help'
import { useState } from 'react'

export interface GuidesPanelProps {
  guides?: Guide[] | null
  className?: string
}

export function GuidesPanel({ guides = [], className }: GuidesPanelProps) {
  const [selectedModule, setSelectedModule] = useState<string>('all')

  const items = Array.isArray(guides) ? guides : []

  const filteredGuides =
    selectedModule && selectedModule !== 'all'
      ? items.filter((g) => g?.module === selectedModule)
      : items

  const modules = [...new Set(items.map((g) => g?.module).filter(Boolean))]

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center gap-4">
        <Select value={selectedModule} onValueChange={setSelectedModule}>
          <SelectTrigger className="w-[200px]" aria-label="Filter by module">
            <SelectValue placeholder="All modules" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All modules</SelectItem>
            {modules.map((m) => (
              <SelectItem key={m} value={m ?? ''}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {filteredGuides.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-muted-foreground">
            No guides available.
          </div>
        ) : (
          filteredGuides.map((guide) => {
            const steps = Array.isArray(guide?.steps) ? guide.steps : []
            return (
              <Card key={guide?.id ?? ''} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {guide?.module ?? ''}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mt-1">
                    {guide?.title ?? ''}
                  </h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <ol className="space-y-3">
                    {steps.map((step, idx) => (
                      <li
                        key={step?.id ?? idx}
                        className="flex items-start gap-3"
                      >
                        <span className="mt-0.5 shrink-0" aria-hidden>
                          {step?.done ? (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {step?.text ?? ''}
                        </span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
