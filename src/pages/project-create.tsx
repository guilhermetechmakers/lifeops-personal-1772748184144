/**
 * Project Create Page - Uses CreateEditProjectWizard
 */

import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateEditProjectWizard } from '@/components/project-detail'
import { createProject } from '@/api/projects'
import { toast } from 'sonner'

export function ProjectCreatePage() {
  const navigate = useNavigate()

  const handleComplete = async (data: { title: string; description?: string; templateId: string }) => {
    try {
      const project = await createProject({
        title: data.title,
        description: data.description,
        templateId: data.templateId,
      })
      if (project?.id) {
        toast.success('Project created!')
        navigate(`/dashboard/projects/${project.id}`)
      } else {
        toast.success('Project created!')
        navigate('/dashboard/projects')
      }
    } catch {
      toast.error('Failed to create project')
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/projects">
          <Button variant="ghost" size="icon" aria-label="Back to projects">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create project</h1>
          <p className="text-muted-foreground">AI-assisted scope generation</p>
        </div>
      </div>

      <CreateEditProjectWizard
        mode="create"
        onComplete={handleComplete}
        onCancel={() => navigate('/dashboard/projects')}
      />
    </div>
  )
}
