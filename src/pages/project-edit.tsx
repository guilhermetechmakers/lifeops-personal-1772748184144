/**
 * Project Edit Page - Uses CreateEditProjectPage
 */

import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateEditProjectPage } from '@/components/create-edit-project'
import { fetchProjectDetail } from '@/api/projects'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import type { CreateEditProject, CreateEditMilestone, CreateEditTask } from '@/types/create-edit-project'

export function ProjectEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const projectId = id ?? ''
  const [projectData, setProjectData] = useState<Partial<CreateEditProject> | null>(null)
  const [milestones, setMilestones] = useState<CreateEditMilestone[]>([])
  const [tasks, setTasks] = useState<CreateEditTask[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!projectId) return
    const load = async () => {
      setIsLoading(true)
      try {
        const detail = await fetchProjectDetail(projectId)
        const proj = detail?.project
        if (proj) {
          const ms = (detail?.milestones ?? []).map((m, i) => ({
            id: m.id,
            projectId: m.projectId,
            title: m.title,
            dueDate: m.dueDate,
            dependencies: [] as string[],
            order: i,
          }))
          const milestoneIds = ms.map((m) => m.id)
          const ts = (detail?.tasks ?? []).map((t, i) => ({
            id: t.id,
            milestoneId: milestoneIds[0] ?? '',
            title: t.title,
            status: (t.status === 'Backlog' ? 'Todo' : t.status === 'In Progress' ? 'InProgress' : t.status === 'Done' ? 'Done' : 'Todo') as CreateEditTask['status'],
            dueDate: t.dueDate ?? undefined,
            dependencies: [] as string[],
            order: i,
          }))
          setProjectData({
            id: proj.id,
            title: proj.title,
            description: proj.description ?? undefined,
            tags: proj.tags ?? [],
            priority: (proj.priority as CreateEditProject['priority']) ?? 'Medium',
            startDate: proj.dueDate ?? undefined,
            endDate: undefined,
            templateId: proj.templateId ?? undefined,
            status: 'Draft',
            createdAt: proj.createdAt ?? undefined,
            updatedAt: proj.updatedAt ?? undefined,
          })
          setMilestones(ms)
          setTasks(ts)
        }
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [projectId])

  const handleSave = (_project: CreateEditProject) => {
    toast.success('Project saved')
  }

  const handlePublish = (project: CreateEditProject) => {
    toast.success('Project published!')
    navigate(`/dashboard/projects/${project.id}`)
  }

  const handleCancel = () => {
    navigate(`/dashboard/projects/${projectId}`)
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to={`/dashboard/projects/${projectId}`}>
          <Button variant="ghost" size="icon" aria-label="Back to project">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      <CreateEditProjectPage
        mode="edit"
        projectData={projectData ?? undefined}
        initialMilestones={milestones}
        initialTasks={tasks}
        onSave={handleSave}
        onPublish={handlePublish}
        onCancel={handleCancel}
      />
    </div>
  )
}
