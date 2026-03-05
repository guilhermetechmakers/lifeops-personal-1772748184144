/**
 * Project Create Page - Uses CreateEditProjectPage
 */

import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateEditProjectPage } from '@/components/create-edit-project'
import { toast } from 'sonner'
import type { CreateEditProject } from '@/types/create-edit-project'

export function ProjectCreatePage() {
  const navigate = useNavigate()

  const handleSave = (_project: CreateEditProject) => {
    toast.success('Project saved as draft')
  }

  const handlePublish = (project: CreateEditProject) => {
    toast.success('Project created!')
    navigate(`/dashboard/projects/${project.id}`)
  }

  const handleCancel = () => {
    navigate('/dashboard/projects')
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/projects">
          <Button variant="ghost" size="icon" aria-label="Back to projects">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      <CreateEditProjectPage
        mode="create"
        onSave={handleSave}
        onPublish={handlePublish}
        onCancel={handleCancel}
      />
    </div>
  )
}
