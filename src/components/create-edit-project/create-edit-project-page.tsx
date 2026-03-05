/**
 * CreateEditProjectPage - Comprehensive Create/Edit Project with wizard and single-page modes
 * Supports AI scope generation, template selection, milestones/tasks, permissions
 */

import { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronDown, ChevronUp, ChevronRight, ChevronLeft, Check, LayoutList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import {
  TemplateCardGrid,
  AIScopeGenerator,
  MilestonesPreview,
  TasksPreview,
  PermissionsPanel,
  ProjectDetailLinkCard,
  PublishBar,
} from '@/components/create-edit-project'
import {
  fetchTemplates,
  generateAIScope,
  createProjectWithScope,
  updateProjectWithScope,
  inviteCollaborator,
} from '@/api/create-edit-project'
import { validatePublish } from '@/utils/validation-project'
import type {
  CreateEditProject,
  CreateEditMilestone,
  CreateEditTask,
  ProjectTemplate,
  AIScopeResult,
  PendingCollaborator,
} from '@/types/create-edit-project'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  tags: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(['Draft', 'Published']),
})

type FormData = z.infer<typeof formSchema>

const WIZARD_STEPS = [
  { id: 'metadata', title: 'Project Info', description: 'Title, description, dates' },
  { id: 'template', title: 'Template', description: 'Choose a starter template' },
  { id: 'scope', title: 'AI Scope', description: 'Generate milestones & tasks' },
  { id: 'plan', title: 'Plan', description: 'Review milestones & tasks' },
  { id: 'collaborators', title: 'Collaborators', description: 'Invite team members' },
  { id: 'review', title: 'Review', description: 'Confirm and publish' },
]

function generateId(): string {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export interface CreateEditProjectPageProps {
  mode: 'create' | 'edit'
  projectData?: Partial<CreateEditProject> & { id?: string }
  initialMilestones?: CreateEditMilestone[]
  initialTasks?: CreateEditTask[]
  onSave?: (project: CreateEditProject) => void
  onPublish?: (project: CreateEditProject) => void
  onCancel?: () => void
}

export function CreateEditProjectPage({
  mode,
  projectData,
  initialMilestones,
  initialTasks,
  onSave,
  onPublish,
  onCancel,
}: CreateEditProjectPageProps) {
  const [workflowMode, setWorkflowMode] = useState<'wizard' | 'single'>('wizard')
  const [step, setStep] = useState(0)
  const [templates, setTemplates] = useState<ProjectTemplate[]>([])
  const [templateId, setTemplateId] = useState<string | null>(null)
  const [goalsInput, setGoalsInput] = useState('')
  const [constraintsInput, setConstraintsInput] = useState('')
  const [aiScope, setAiScope] = useState<AIScopeResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [milestones, setMilestones] = useState<CreateEditMilestone[]>(
    Array.isArray(initialMilestones) ? initialMilestones : (initialMilestones ?? [])
  )
  const [tasks, setTasks] = useState<CreateEditTask[]>(
    Array.isArray(initialTasks) ? initialTasks : (initialTasks ?? [])
  )
  const [collaborators, setCollaborators] = useState<PendingCollaborator[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    metadata: true,
    template: true,
    scope: false,
    plan: true,
    collaborators: false,
  })

  const projectId = projectData?.id ?? createdProjectId ?? ''

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: projectData?.title ?? '',
      description: projectData?.description ?? '',
      priority: (projectData?.priority as FormData['priority']) ?? 'Medium',
      startDate: projectData?.startDate ?? '',
      endDate: projectData?.endDate ?? '',
      status: (projectData?.status as FormData['status']) ?? 'Draft',
    },
  })

  const tagsStr = watch('tags') ?? ''
  const tags = tagsStr ? tagsStr.split(',').map((t) => t.trim()).filter(Boolean) : []

  useEffect(() => {
    fetchTemplates().then((list) => {
      const arr = Array.isArray(list) ? list : (list ?? [])
      setTemplates(arr)
    })
  }, [])

  const handleApplyTemplate = useCallback((tid: string) => {
    setTemplateId(tid)
    const t = templates.find((x) => x.id === tid)
    if (t?.defaultMetadata) {
      if (t.defaultMetadata.title) setValue('title', t.defaultMetadata.title)
      if (t.defaultMetadata.description) setValue('description', t.defaultMetadata.description)
      if (t.defaultMetadata.priority) setValue('priority', t.defaultMetadata.priority)
      if (t.defaultMetadata.tags?.length) setValue('tags', t.defaultMetadata.tags.join(', '))
    }
    if (t?.defaultMilestones?.length) {
      const ms: CreateEditMilestone[] = (t.defaultMilestones ?? []).map((m, i) => ({
        id: generateId(),
        projectId: '',
        title: m.title,
        dueDate: m.dueDate,
        dependencies: m.dependencies ?? [],
        order: i,
      }))
      setMilestones(ms)
    }
    if (t?.defaultTasks?.length) {
      const ts: CreateEditTask[] = (t.defaultTasks ?? []).map((t, i) => ({
        id: generateId(),
        milestoneId: '',
        title: t.title,
        status: t.status ?? 'Todo',
        dueDate: t.dueDate,
        dependencies: t.dependencies ?? [],
        order: i,
      }))
      setTasks(ts)
    }
  }, [templates, setValue])

  const handleGenerateScope = useCallback(async () => {
    setIsGenerating(true)
    try {
      const result = await generateAIScope(goalsInput, constraintsInput)
      setAiScope({
        milestones: Array.isArray(result?.milestones) ? result.milestones : [],
        tasks: Array.isArray(result?.tasks) ? result.tasks : [],
      })
    } finally {
      setIsGenerating(false)
    }
  }, [goalsInput, constraintsInput])

  const handleAcceptScope = useCallback((ms: CreateEditMilestone[], ts: CreateEditTask[]) => {
    const projectIdVal = projectId || 'temp'
    const msList = (ms ?? []).map((m, i) => ({
      ...m,
      id: m.id ?? generateId(),
      projectId: m.projectId || projectIdVal,
      order: i,
    }))
    const firstMilestoneId = msList[0]?.id ?? 'm0'
    setMilestones(msList)
    setTasks(
      (ts ?? []).map((t, i) => ({
        ...t,
        id: t.id ?? generateId(),
        milestoneId: t.milestoneId || firstMilestoneId,
        order: i,
      }))
    )
    setAiScope(null)
  }, [projectId])

  const handleDiscardScope = useCallback(() => setAiScope(null), [])

  const handleAddCollaborator = useCallback((email: string, role: string) => {
    setCollaborators((prev) => [
      ...prev,
      { id: generateId(), email, role, status: 'pending' as const },
    ])
  }, [])

  const handleRemoveCollaborator = useCallback((id: string) => {
    setCollaborators((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const validTemplateIds = templates.map((t) => t.id)
  const validation = validatePublish(
    { title: watch('title'), startDate: watch('startDate'), endDate: watch('endDate'), templateId: templateId ?? undefined },
    milestones,
    tasks,
    validTemplateIds
  )

  const preparePayload = useCallback(() => {
    const now = new Date().toISOString()
    return {
      project: {
        id: projectId || generateId(),
        title: watch('title'),
        description: watch('description') || undefined,
        tags,
        priority: watch('priority'),
        startDate: watch('startDate') || undefined,
        endDate: watch('endDate') || undefined,
        templateId: templateId ?? undefined,
        status: watch('status') as 'Draft' | 'Published',
        createdAt: projectData?.createdAt ?? now,
        updatedAt: now,
      } as CreateEditProject,
      milestones: milestones.map((m, i) => ({
        ...m,
        projectId: m.projectId || projectId || 'temp',
        order: i,
      })),
      tasks: tasks.map((t, i) => ({
        ...t,
        milestoneId: t.milestoneId || (milestones[0]?.id ?? 'm0'),
        order: i,
      })),
    }
  }, [projectId, projectData, watch, tags, milestones, tasks, templateId])

  const onSaveDraft = useCallback(async () => {
    setIsSaving(true)
    try {
      const { project, milestones: ms, tasks: ts } = preparePayload()
      if (mode === 'edit' && project.id) {
        const res = await updateProjectWithScope(project.id, { project, milestones: ms, tasks: ts })
        if (res) {
          onSave?.(res.project)
        }
      } else {
        const res = await createProjectWithScope({ project, milestones: ms, tasks: ts })
        if (res) {
          setCreatedProjectId(res.project.id)
          onSave?.(res.project)
        }
      }
    } finally {
      setIsSaving(false)
    }
  }, [mode, preparePayload, onSave])

  const onPublishClick = useCallback(async () => {
    if (!validation.valid) return
    setIsPublishing(true)
    try {
      const { project, milestones: ms, tasks: ts } = preparePayload()
      let result: { project: CreateEditProject } | null = null
      if (mode === 'edit' && project.id) {
        const res = await updateProjectWithScope(project.id, {
          project: { ...project, status: 'Published' },
          milestones: ms,
          tasks: ts,
        })
        result = res ? { project: res.project } : null
      } else {
        const res = await createProjectWithScope({
          project: { ...project, status: 'Published' },
          milestones: ms,
          tasks: ts,
        })
        result = res ? { project: res.project } : null
      }
      if (result) {
        setCreatedProjectId(result.project.id)
        for (const c of collaborators) {
          await inviteCollaborator(result.project.id, c.email, c.role)
        }
        onPublish?.(result.project)
      }
    } finally {
      setIsPublishing(false)
    }
  }, [mode, validation.valid, preparePayload, collaborators, onPublish])

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const renderMetadataSection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Project Info</CardTitle>
        <CardDescription>Basic metadata for your project</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title (required)</Label>
          <Input
            id="title"
            placeholder="My project"
            {...register('title')}
            className={errors.title ? 'border-destructive' : ''}
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <p className="text-sm text-destructive" role="alert">
              {errors.title.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Brief description"
            {...register('description')}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input id="tags" placeholder="product, launch" {...register('tags')} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={watch('priority')}
              onValueChange={(v) => setValue('priority', v as FormData['priority'])}
            >
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <div className="flex items-center gap-2">
              <Switch
                id="status"
                checked={watch('status') === 'Published'}
                onCheckedChange={(checked) => setValue('status', checked ? 'Published' : 'Draft')}
              />
              <Label htmlFor="status">{watch('status')}</Label>
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" type="date" {...register('startDate')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" type="date" {...register('endDate')} />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderTemplateSection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Templates</CardTitle>
        <CardDescription>Choose a starter template or start from scratch</CardDescription>
      </CardHeader>
      <CardContent>
        <TemplateCardGrid
          templates={templates}
          onApply={handleApplyTemplate}
          appliedTemplateId={templateId}
        />
      </CardContent>
    </Card>
  )

  const renderScopeSection = () => (
    <AIScopeGenerator
      goalsInput={goalsInput}
      constraintsInput={constraintsInput}
      onGoalsChange={setGoalsInput}
      onConstraintsChange={setConstraintsInput}
      onGenerate={handleGenerateScope}
      aiScope={aiScope}
      onAccept={handleAcceptScope}
      onDiscard={handleDiscardScope}
      isLoading={isGenerating}
    />
  )

  const renderPlanSection = () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <MilestonesPreview
        milestones={milestones}
        onUpdate={setMilestones}
        projectId={projectId || 'temp'}
      />
      <TasksPreview
        tasks={tasks}
        onUpdate={setTasks}
        milestoneId={milestones[0]?.id ?? 'm0'}
      />
    </div>
  )

  const renderCollaboratorsSection = () => (
    <PermissionsPanel
      collaborators={collaborators}
      onAdd={handleAddCollaborator}
      onRemove={handleRemoveCollaborator}
    />
  )

  if (workflowMode === 'single') {
    return (
      <div className="mx-auto max-w-4xl space-y-6 pb-24">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {mode === 'create' ? 'Create Project' : 'Edit Project'}
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWorkflowMode('wizard')}
            className="gap-2"
          >
            <LayoutList className="h-4 w-4" />
            Switch to Wizard
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSaveDraft)} className="space-y-6">
          {renderMetadataSection()}
          {renderTemplateSection()}

          <Card>
            <button
              type="button"
              className="flex w-full items-center justify-between p-5 text-left"
              onClick={() => toggleSection('scope')}
              aria-expanded={expandedSections.scope}
            >
              <CardTitle className="!mb-0">AI Scope Generator</CardTitle>
              {expandedSections.scope ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {expandedSections.scope && (
              <CardContent className="pt-0">
                {renderScopeSection()}
              </CardContent>
            )}
          </Card>

          {renderPlanSection()}
          {renderCollaboratorsSection()}

          {createdProjectId && (
            <ProjectDetailLinkCard projectId={createdProjectId} />
          )}

          <PublishBar
            onSaveDraft={onSaveDraft}
            onPublish={onPublishClick}
            onCancel={onCancel ?? (() => {})}
            isPublishing={isPublishing}
            isSaving={isSaving}
            canPublish={!!watch('title')?.trim()}
            validationErrors={validation.errors}
          />
        </form>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-24 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {mode === 'create' ? 'Create Project' : 'Edit Project'}
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setWorkflowMode('single')}
          className="gap-2"
        >
          Single-page form
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {WIZARD_STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-200',
                i < step ? 'bg-primary text-primary-foreground' : '',
                i === step ? 'border-2 border-primary bg-card' : '',
                i > step ? 'border border-border bg-muted text-muted-foreground' : ''
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {i < WIZARD_STEPS.length - 1 && (
              <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(() => {})} className="space-y-6">
        {step === 0 && renderMetadataSection()}
        {step === 1 && renderTemplateSection()}
        {step === 2 && renderScopeSection()}
        {step === 3 && renderPlanSection()}
        {step === 4 && renderCollaboratorsSection()}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Review</CardTitle>
              <CardDescription>Confirm and publish your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p><strong>Title:</strong> {watch('title')}</p>
              <p><strong>Template:</strong> {templates.find((t) => t.id === templateId)?.name ?? 'None'}</p>
              <p><strong>Milestones:</strong> {milestones.length}</p>
              <p><strong>Tasks:</strong> {tasks.length}</p>
              {createdProjectId && (
                <ProjectDetailLinkCard projectId={createdProjectId} />
              )}
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
            {step < WIZARD_STEPS.length - 1 ? (
              <Button
                type="button"
                className="gradient-primary text-primary-foreground"
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 0 && !watch('title')?.trim()}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSaveDraft}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </Button>
                <Button
                  type="button"
                  className="gradient-primary text-primary-foreground"
                  onClick={onPublishClick}
                  disabled={!validation.valid || isPublishing}
                >
                  {isPublishing ? 'Publishing...' : 'Publish'}
                </Button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
