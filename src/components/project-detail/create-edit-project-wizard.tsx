/**
 * CreateEditProjectWizard - Multi-step wizard for creating/editing projects
 * Steps: Basic Info, Scope & Templates, AI-assisted breakdown, Review & Create
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Sparkles, Check, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled']).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
})

type FormData = z.infer<typeof schema>

const TEMPLATES = [
  { id: 'blank', name: 'Blank project', description: 'Start from scratch' },
  { id: 'product', name: 'Product launch', description: 'Product launch checklist' },
  { id: 'marketing', name: 'Marketing campaign', description: 'Campaign planning' },
  { id: 'research', name: 'Research project', description: 'Research and analysis' },
]

const STEPS = [
  { id: 'basic', title: 'Basic Info', description: 'Project name and description' },
  { id: 'scope', title: 'Scope & Templates', description: 'Choose a template' },
  { id: 'ai', title: 'AI-assisted breakdown', description: 'Generate milestones and tasks' },
  { id: 'review', title: 'Review & Create', description: 'Confirm and create' },
]

export interface CreateEditProjectWizardProps {
  mode?: 'create' | 'edit'
  initialData?: Partial<FormData>
  onComplete?: (data: FormData & { templateId: string }) => void
  onCancel?: () => void
}

export function CreateEditProjectWizard({
  mode = 'create',
  initialData,
  onComplete,
  onCancel,
}: CreateEditProjectWizardProps) {
  const [step, setStep] = useState(0)
  const [templateId, setTemplateId] = useState('blank')
  const [aiBreakdown, setAiBreakdown] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      status: (initialData?.status as FormData['status']) ?? 'Planning',
      priority: (initialData?.priority as FormData['priority']) ?? 'Medium',
    },
  })

  const title = watch('title')
  const description = watch('description')

  const handleAiBreakdown = async () => {
    setIsGenerating(true)
    await new Promise((r) => setTimeout(r, 1500))
    setAiBreakdown([
      'Define project scope',
      'Create initial milestones',
      'Break down into tasks',
      'Assign priorities',
    ])
    setIsGenerating(false)
  }

  const onSubmit = (formData: FormData) => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1)
    } else {
      onComplete?.({ ...formData, templateId })
    }
  }

  const canProceed = step === 0 ? !!title?.trim() : true

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                i < step ? 'bg-primary text-primary-foreground' : '',
                i === step ? 'border-2 border-primary bg-card' : '',
                i > step ? 'border border-border bg-muted text-muted-foreground' : ''
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      <Progress value={((step + 1) / STEPS.length) * 100} className="h-2" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{STEPS[0].title}</CardTitle>
              <CardDescription>{STEPS[0].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project name</Label>
                <Input
                  id="title"
                  placeholder="My project"
                  {...register('title')}
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the project"
                  {...register('description')}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>{STEPS[1].title}</CardTitle>
              <CardDescription>{STEPS[1].description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplateId(t.id)}
                    className={cn(
                      'rounded-xl border-2 p-4 text-left transition-all duration-200',
                      templateId === t.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <p className="font-medium">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>{STEPS[2].title}</CardTitle>
              <CardDescription>{STEPS[2].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleAiBreakdown}
                disabled={isGenerating}
              >
                <Sparkles className="h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Generate AI breakdown'}
              </Button>
              {aiBreakdown.length > 0 && (
                <ul className="space-y-2 rounded-lg border border-border p-4">
                  {aiBreakdown.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>{STEPS[3].title}</CardTitle>
              <CardDescription>{STEPS[3].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Project name</p>
                <p className="font-medium">{title || '—'}</p>
              </div>
              {description && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{description}</p>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Template</p>
                <p className="font-medium">
                  {TEMPLATES.find((t) => t.id === templateId)?.name ?? 'Blank'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between gap-2">
          <div>
            {step > 0 && (
              <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className="gradient-primary text-primary-foreground"
              disabled={!canProceed}
            >
              {step < STEPS.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  {mode === 'create' ? 'Create project' : 'Save changes'}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
