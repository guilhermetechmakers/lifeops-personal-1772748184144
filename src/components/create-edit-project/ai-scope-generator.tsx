/**
 * AIScopeGenerator - Input for goals/constraints, Generate Scope action, expandable result panel
 * Guard: handle null responses; default to [] for tasks/milestones
 */

import { useState } from 'react'
import { Sparkles, ChevronDown, ChevronUp, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { CreateEditMilestone, CreateEditTask, AIScopeResult } from '@/types/create-edit-project'

export interface AIScopeGeneratorProps {
  goalsInput: string
  constraintsInput: string
  onGoalsChange: (value: string) => void
  onConstraintsChange: (value: string) => void
  onGenerate: () => void | Promise<void>
  aiScope: AIScopeResult | null
  onAccept: (milestones: CreateEditMilestone[], tasks: CreateEditTask[]) => void
  onDiscard: () => void
  isLoading?: boolean
}

export function AIScopeGenerator({
  goalsInput,
  constraintsInput,
  onGoalsChange,
  onConstraintsChange,
  onGenerate,
  aiScope,
  onAccept,
  onDiscard,
  isLoading = false,
}: AIScopeGeneratorProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const milestones = Array.isArray(aiScope?.milestones) ? aiScope.milestones : []
  const tasks = Array.isArray(aiScope?.tasks) ? aiScope.tasks : []
  const hasResult = milestones.length > 0 || tasks.length > 0

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Scope Generator
        </CardTitle>
        <CardDescription>
          Provide goals and constraints to generate suggested milestones and tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="goals">Goals</Label>
          <Textarea
            id="goals"
            placeholder="e.g. Launch MVP in 6 weeks, include user auth and dashboard"
            value={goalsInput}
            onChange={(e) => onGoalsChange(e.target.value)}
            rows={3}
            className="resize-none"
            aria-describedby="goals-hint"
          />
          <p id="goals-hint" className="text-xs text-muted-foreground">
            Describe what you want to achieve
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="constraints">Constraints</Label>
          <Textarea
            id="constraints"
            placeholder="e.g. Budget limited, 2 team members, must use existing API"
            value={constraintsInput}
            onChange={(e) => onConstraintsChange(e.target.value)}
            rows={2}
            className="resize-none"
            aria-describedby="constraints-hint"
          />
          <p id="constraints-hint" className="text-xs text-muted-foreground">
            Any limitations or requirements
          </p>
        </div>
        <Button
          className="w-full gradient-primary text-primary-foreground transition-all duration-200 hover:scale-[1.02]"
          onClick={() => onGenerate()}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          <Sparkles className="h-4 w-4" />
          {isLoading ? 'Generating...' : 'Generate Scope'}
        </Button>

        {hasResult && (
          <div className="rounded-xl border border-border bg-muted/30">
            <button
              type="button"
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-controls="ai-scope-panel"
            >
              <span className="font-medium">
                AI-generated scope ({milestones.length} milestones, {tasks.length} tasks)
              </span>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            <div
              id="ai-scope-panel"
              className={cn(
                'border-t border-border transition-all duration-300',
                isExpanded ? 'block animate-fade-in' : 'hidden'
              )}
            >
              <div className="space-y-4 p-4">
                {milestones.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">Milestones</p>
                    <ul className="space-y-2">
                      {(milestones ?? []).map((m, i) => (
                        <li
                          key={m.id ?? i}
                          className="flex items-center gap-2 rounded-lg bg-card px-3 py-2 text-sm"
                        >
                          <span className="h-2 w-2 rounded-full bg-primary" />
                          {m.title}
                          {m.dueDate && (
                            <span className="text-muted-foreground">({m.dueDate})</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tasks.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">Tasks</p>
                    <ul className="space-y-2">
                      {(tasks ?? []).map((t, i) => (
                        <li
                          key={t.id ?? i}
                          className="flex items-center gap-2 rounded-lg bg-card px-3 py-2 text-sm"
                        >
                          <span className="h-2 w-2 rounded-full bg-accent" />
                          {t.title}
                          <span className="text-muted-foreground">({t.status})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDiscard}
                    className="gap-2"
                    aria-label="Discard AI scope"
                  >
                    <X className="h-4 w-4" />
                    Discard
                  </Button>
                  <Button
                    size="sm"
                    className="gap-2 gradient-primary text-primary-foreground"
                    onClick={() => onAccept(milestones, tasks)}
                    aria-label="Accept AI scope"
                  >
                    <Check className="h-4 w-4" />
                    Accept & Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
