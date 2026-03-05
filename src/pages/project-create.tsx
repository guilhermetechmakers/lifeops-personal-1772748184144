import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const templates = [
  { id: 'blank', name: 'Blank project' },
  { id: 'product', name: 'Product launch' },
  { id: 'marketing', name: 'Marketing campaign' },
]

export function ProjectCreatePage() {
  const navigate = useNavigate()
  const [template, setTemplate] = useState('blank')
  const [isGenerating, setIsGenerating] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '' },
  })

  const onSubmit = async (_data: FormData) => {
    try {
      await new Promise((r) => setTimeout(r, 500))
      toast.success('Project created!')
      navigate('/dashboard/projects')
    } catch {
      toast.error('Failed to create project')
    }
  }

  const handleAiScope = async () => {
    setIsGenerating(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsGenerating(false)
    toast.success('AI scope generated')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create project</h1>
          <p className="text-muted-foreground">AI-assisted scope generation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Template</CardTitle>
            <CardDescription>Start from a template or blank</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {templates.map((t) => (
                <Button
                  key={t.id}
                  type="button"
                  variant={template === t.id ? 'default' : 'outline'}
                  onClick={() => setTemplate(t.id)}
                >
                  {t.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>Project name and description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="My project"
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Optional description"
                {...register('description')}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleAiScope}
              disabled={isGenerating}
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? 'Generating...' : 'AI Scope Generator'}
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Link to="/dashboard/projects">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" className="gradient-primary text-primary-foreground">
            Create project
          </Button>
        </div>
      </form>
    </div>
  )
}
