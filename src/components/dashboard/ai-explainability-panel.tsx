import { useState, useCallback } from 'react'
import { Sparkles, RotateCcw, HelpCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { AIActionAudit } from '@/types/dashboard'
import { fetchAIExplain, undoAIAction } from '@/api/dashboard'
import { toast } from 'sonner'

export interface AIExplainabilityPanelProps {
  aiAudits?: AIActionAudit[] | null
  isLoading?: boolean
  onUndo?: (actionId: string) => void
}

export function AIExplainabilityPanel({
  aiAudits = [],
  isLoading = false,
  onUndo,
}: AIExplainabilityPanelProps) {
  const items = Array.isArray(aiAudits) ? aiAudits : []
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [explainData, setExplainData] = useState<{
    actionId: string
    explanation: string
    sources: string[]
    rationale: string
    confidence: number
  } | null>(null)
  const [undoConfirmId, setUndoConfirmId] = useState<string | null>(null)
  const [isUndoing, setIsUndoing] = useState(false)

  const handleWhy = useCallback(async (actionId: string) => {
    if (expandedId === actionId) {
      setExpandedId(null)
      setExplainData(null)
      return
    }
    const data = await fetchAIExplain(actionId)
    if (data) {
      setExplainData(data)
      setExpandedId(actionId)
    } else {
      toast.error('Could not load explanation')
    }
  }, [expandedId])

  const handleUndoClick = useCallback((actionId: string) => {
    setUndoConfirmId(actionId)
  }, [])

  const handleUndoConfirm = useCallback(async () => {
    const id = undoConfirmId
    if (!id) return
    setIsUndoing(true)
    try {
      const res = await undoAIAction(id)
      if (res?.success) {
        toast.success('Action reverted successfully')
        onUndo?.(id)
        setUndoConfirmId(null)
      } else {
        toast.error('Could not revert action')
      }
    } catch {
      toast.error('Could not revert action')
    } finally {
      setIsUndoing(false)
    }
  }, [undoConfirmId, onUndo])

  const handleUndoCancel = useCallback(() => {
    setUndoConfirmId(null)
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Recent AI decisions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-border p-4">
                <div className="mb-2 h-4 w-full rounded bg-muted" />
                <div className="mb-3 h-3 w-3/4 rounded bg-muted" />
                <div className="flex gap-2">
                  <div className="h-8 w-16 rounded bg-muted" />
                  <div className="h-8 w-12 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card id="explainability">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Recent AI decisions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Sparkles className="mb-2 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No recent AI decisions</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.slice(0, 5).map((item) => (
                <li
                  key={item?.id ?? ''}
                  className="rounded-xl border border-border p-4 transition-all duration-200 hover:border-primary/30"
                >
                  <p className="font-medium">{item?.actionType ?? 'AI action'}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item?.rationale ?? ''}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      Confidence: {item?.confidence ?? 0}%
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleWhy(item?.id ?? '')}
                        className="gap-1"
                      >
                        <HelpCircle className="h-4 w-4" />
                        Why?
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUndoClick(item?.id ?? '')}
                        className="gap-1"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Undo
                      </Button>
                    </div>
                  </div>
                  {expandedId === item?.id && explainData && (
                    <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3">
                      <p className="text-sm font-medium">Explanation</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {explainData.explanation}
                      </p>
                      {(explainData.sources ?? []).length > 0 && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Sources: {(explainData.sources ?? []).join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={undoConfirmId != null} onOpenChange={(o) => !o && handleUndoCancel()}>
        <DialogContent showClose>
          <DialogHeader>
            <DialogTitle>Revert AI action?</DialogTitle>
            <DialogDescription>
              This will undo the selected AI action. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleUndoCancel} disabled={isUndoing}>
              Cancel
            </Button>
            <Button
              className="gradient-primary text-primary-foreground"
              onClick={handleUndoConfirm}
              disabled={isUndoing}
            >
              {isUndoing ? 'Reverting...' : 'Revert'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
