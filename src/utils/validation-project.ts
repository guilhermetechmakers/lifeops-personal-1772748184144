/**
 * ValidationUtility - Pure helpers for Create/Edit Project
 * Required fields, date ranges, template validity
 */

import type { CreateEditProject, CreateEditMilestone, CreateEditTask } from '@/types/create-edit-project'

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function validateRequiredFields(project: Partial<CreateEditProject>): ValidationResult {
  const errors: string[] = []
  if (!project?.title?.trim()) {
    errors.push('Title is required')
  }
  return {
    valid: errors.length === 0,
    errors,
  }
}

export function validateDateRange(
  startDate?: string | null,
  endDate?: string | null
): ValidationResult {
  const errors: string[] = []
  if (!startDate && !endDate) return { valid: true, errors: [] }
  try {
    if (startDate && endDate) {
      const start = new Date(startDate).getTime()
      const end = new Date(endDate).getTime()
      if (isNaN(start) || isNaN(end)) {
        errors.push('Invalid date format')
      } else if (end < start) {
        errors.push('End date must be after start date')
      }
    }
  } catch {
    errors.push('Invalid date format')
  }
  return {
    valid: errors.length === 0,
    errors,
  }
}

export function validateTemplateId(
  templateId: string | undefined,
  validIds: string[]
): ValidationResult {
  if (!templateId) return { valid: true, errors: [] }
  const ids = Array.isArray(validIds) ? validIds : []
  if (ids.length > 0 && !ids.includes(templateId)) {
    return { valid: false, errors: ['Selected template is not valid'] }
  }
  return { valid: true, errors: [] }
}

export function validatePublish(
  project: Partial<CreateEditProject>,
  milestones: CreateEditMilestone[],
  tasks: CreateEditTask[],
  validTemplateIds: string[] = []
): ValidationResult {
  const errors: string[] = []

  const required = validateRequiredFields(project)
  errors.push(...required.errors)

  const dates = validateDateRange(project?.startDate, project?.endDate)
  errors.push(...dates.errors)

  const template = validateTemplateId(project?.templateId, validTemplateIds)
  errors.push(...template.errors)

  const ms = Array.isArray(milestones) ? milestones : []
  const ts = Array.isArray(tasks) ? tasks : []
  if (ms.length === 0 && ts.length === 0) {
    errors.push('At least one milestone or task is required to publish')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email?.trim() ?? '')
}
