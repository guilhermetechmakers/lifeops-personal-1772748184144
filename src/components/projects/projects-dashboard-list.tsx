/**
 * ProjectsDashboardList - Main container for projects dashboard
 * Handles filters, search, project list, and navigation
 */

import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchProjects } from '@/api/projects'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import type { Project, ProjectFilters } from '@/types/projects'
import { DEFAULT_PROJECT_FILTERS } from '@/types/projects'
import { SearchBar } from './search-bar'
import { FiltersBar } from './filters-bar'
import { ProjectCard } from './project-card'
import { EmptyState } from './empty-state'
import { CardSkeleton } from './card-skeleton'
import { CreateProjectFab } from './create-project-fab'
import { toast } from 'sonner'

function isDueThisWeek(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const now = new Date()
  const start = new Date(now)
  start.setDate(now.getDate() - now.getDay())
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 7)
  return d >= start && d < end
}

function isDueThisMonth(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

function isOverdue(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  d.setHours(23, 59, 59, 999)
  return d < new Date()
}

function filterProjects(
  projects: Project[],
  filters: ProjectFilters,
  search: string
): Project[] {
  let result = projects ?? []

  if (search.trim()) {
    const q = search.toLowerCase().trim()
    result = result.filter(
      (p) =>
        p?.title?.toLowerCase().includes(q) ||
        (Array.isArray(p?.tags) && p.tags.some((t) => t?.toLowerCase().includes(q)))
    )
  }

  if (filters?.status && filters.status !== 'All') {
    result = result.filter((p) => p?.status === filters.status)
  }

  if (filters?.dueDatePreset && filters.dueDatePreset !== 'all') {
    result = result.filter((p) => {
      const due = p?.dueDate ?? p?.nextMilestone?.dueDate
      if (!due) return filters.dueDatePreset === 'overdue' ? false : false
      if (filters.dueDatePreset === 'overdue') return isOverdue(due)
      if (filters.dueDatePreset === 'this_week') return isDueThisWeek(due)
      if (filters.dueDatePreset === 'this_month') return isDueThisMonth(due)
      return true
    })
  }

  if (filters?.priority && filters.priority !== 'All') {
    result = result.filter((p) => p?.priority === filters.priority)
  }

  if (Array.isArray(filters?.tags) && filters.tags.length > 0) {
    result = result.filter(
      (p) =>
        Array.isArray(p?.tags) &&
        filters.tags.some((t) => p.tags?.includes(t))
    )
  }

  if (filters?.aiRecommendationsOnly === true) {
    result = result.filter((p) => p?.aiRecommendation?.trim?.())
  }

  if (filters?.nextMilestone && filters.nextMilestone !== 'all') {
    result = result.filter((p) => {
      const milestone = p?.nextMilestone
      const due = milestone?.dueDate
      if (filters.nextMilestone === 'has_milestone') return !!milestone
      if (!due) return false
      if (filters.nextMilestone === 'overdue') return isOverdue(due)
      if (filters.nextMilestone === 'due_this_week') return isDueThisWeek(due)
      return true
    })
  }

  return result
}

export function ProjectsDashboardList() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<ProjectFilters>(DEFAULT_PROJECT_FILTERS)

  const debouncedSearch = useDebouncedValue(search, 300)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    fetchProjects({
      search: debouncedSearch || undefined,
      status: filters.status !== 'All' ? filters.status : undefined,
      tags: filters.tags.length ? filters.tags : undefined,
      priority: filters.priority !== 'All' ? filters.priority : undefined,
    })
      .then((data) => {
        if (!cancelled) {
          const list = Array.isArray(data) ? data : (data ?? [])
          setProjects(list)
        }
      })
      .catch(() => {
        if (!cancelled) setProjects([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [debouncedSearch, filters.status, filters.tags.join(','), filters.priority, filters.aiRecommendationsOnly, filters.nextMilestone])

  const filteredProjects = useMemo(
    () => filterProjects(projects, filters, debouncedSearch),
    [projects, filters, debouncedSearch]
  )

  const availableTags = useMemo(() => {
    const set = new Set<string>()
    ;(projects ?? []).forEach((p) => {
      ;(p?.tags ?? []).forEach((t) => t && set.add(t))
    })
    return Array.from(set)
  }, [projects])

  const handleOpen = (projectId: string) => {
    navigate(`/dashboard/projects/${projectId}`)
  }

  const handleEdit = (projectId: string) => {
    navigate(`/dashboard/projects/${projectId}?edit=true`)
    toast.info('Edit project')
  }

  const handleArchive = (projectId: string) => {
    setProjects((prev) => (prev ?? []).filter((p) => p?.id !== projectId))
    toast.success('Project archived')
  }

  const handleDuplicate = (projectId: string) => {
    const project = (projects ?? []).find((p) => p?.id === projectId)
    if (project) {
      navigate(`/dashboard/projects/new?duplicate=${projectId}`)
      toast.success('Opening project creation to duplicate')
    }
  }

  const handleAiPlan = (projectId: string) => {
    navigate(`/dashboard/projects/${projectId}?aiPlan=true`)
    toast.success('Opening AI-assisted planner')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Projects</h1>
          <p className="mt-1 text-muted-foreground">
            Manage projects with AI-assisted planning
          </p>
        </div>
        <Link to="/dashboard/projects/new" className="hidden sm:inline-flex">
            <Button className="gradient-primary text-primary-foreground">
            <Plus className="h-5 w-5" />
            Create Project
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        <SearchBar value={search} onChange={setSearch} />
        <FiltersBar
          filters={filters}
          onFiltersChange={(partial) =>
            setFilters((prev) => ({ ...prev, ...partial }))
          }
          availableTags={availableTags}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (filteredProjects ?? []).length === 0 ? (
        <EmptyState
          title={projects.length === 0 ? 'No projects yet' : 'No matching projects'}
          description={
            projects.length === 0
              ? 'Create your first project to get started. Use AI-assisted planning to break down goals into milestones and tasks.'
              : 'Try adjusting your filters or search to find projects.'
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(filteredProjects ?? []).map((project) => (
            <ProjectCard
              key={project?.id ?? ''}
              project={project}
              onOpen={handleOpen}
              onEdit={handleEdit}
              onArchive={handleArchive}
              onDuplicate={handleDuplicate}
              onAiPlan={handleAiPlan}
            />
          ))}
        </div>
      )}

      <CreateProjectFab />
    </div>
  )
}
