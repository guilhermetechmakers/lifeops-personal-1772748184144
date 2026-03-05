/**
 * Curated project templates for Create / Edit Project
 * Move Home, Wedding Planning, Side Project Launch, Study Plan
 */

import type { ProjectTemplate } from '@/types/create-edit-project'

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'move-home',
    name: 'Move Home',
    description: 'Plan your relocation with milestones for packing, moving, and settling in.',
    previewUrl: undefined,
    defaultMetadata: {
      title: 'Move Home',
      description: 'Complete relocation planning and execution',
      tags: ['moving', 'relocation', 'home'],
      priority: 'High',
    },
    defaultMilestones: [
      { title: 'Pre-move preparation', dueDate: undefined, dependencies: [], order: 0 },
      { title: 'Packing & inventory', dueDate: undefined, dependencies: [], order: 1 },
      { title: 'Moving day', dueDate: undefined, dependencies: [], order: 2 },
      { title: 'Settle in', dueDate: undefined, dependencies: [], order: 3 },
    ],
    defaultTasks: [
      { title: 'Research moving companies', status: 'Todo', dependencies: [], order: 0 },
      { title: 'Create inventory list', status: 'Todo', dependencies: [], order: 1 },
      { title: 'Book movers', status: 'Todo', dependencies: [], order: 2 },
      { title: 'Pack non-essentials', status: 'Todo', dependencies: [], order: 3 },
      { title: 'Update address', status: 'Todo', dependencies: [], order: 4 },
    ],
  },
  {
    id: 'wedding-planning',
    name: 'Wedding Planning',
    description: 'Organize your big day with venue, vendors, and timeline milestones.',
    previewUrl: undefined,
    defaultMetadata: {
      title: 'Wedding Planning',
      description: 'Wedding planning from venue to vows',
      tags: ['wedding', 'events', 'planning'],
      priority: 'High',
    },
    defaultMilestones: [
      { title: 'Venue & date secured', dueDate: undefined, dependencies: [], order: 0 },
      { title: 'Vendors booked', dueDate: undefined, dependencies: [], order: 1 },
      { title: 'Invitations sent', dueDate: undefined, dependencies: [], order: 2 },
      { title: 'Final details', dueDate: undefined, dependencies: [], order: 3 },
    ],
    defaultTasks: [
      { title: 'Create guest list', status: 'Todo', dependencies: [], order: 0 },
      { title: 'Visit venues', status: 'Todo', dependencies: [], order: 1 },
      { title: 'Book photographer', status: 'Todo', dependencies: [], order: 2 },
      { title: 'Order invitations', status: 'Todo', dependencies: [], order: 3 },
      { title: 'Plan rehearsal dinner', status: 'Todo', dependencies: [], order: 4 },
    ],
  },
  {
    id: 'side-project-launch',
    name: 'Side Project Launch',
    description: 'Launch your side project with MVP scope, design, and launch milestones.',
    previewUrl: undefined,
    defaultMetadata: {
      title: 'Side Project Launch',
      description: 'Build and launch a side project',
      tags: ['product', 'launch', 'mvp'],
      priority: 'Medium',
    },
    defaultMilestones: [
      { title: 'MVP scope defined', dueDate: undefined, dependencies: [], order: 0 },
      { title: 'Design complete', dueDate: undefined, dependencies: [], order: 1 },
      { title: 'Development phase', dueDate: undefined, dependencies: [], order: 2 },
      { title: 'Launch & iterate', dueDate: undefined, dependencies: [], order: 3 },
    ],
    defaultTasks: [
      { title: 'Define core features', status: 'Todo', dependencies: [], order: 0 },
      { title: 'Create wireframes', status: 'Todo', dependencies: [], order: 1 },
      { title: 'Set up dev environment', status: 'Todo', dependencies: [], order: 2 },
      { title: 'Build MVP', status: 'Todo', dependencies: [], order: 3 },
      { title: 'Deploy to production', status: 'Todo', dependencies: [], order: 4 },
    ],
  },
  {
    id: 'study-plan',
    name: 'Study Plan',
    description: 'Structure your learning with modules, milestones, and practice tasks.',
    previewUrl: undefined,
    defaultMetadata: {
      title: 'Study Plan',
      description: 'Structured learning plan with milestones',
      tags: ['learning', 'education', 'study'],
      priority: 'Medium',
    },
    defaultMilestones: [
      { title: 'Foundation complete', dueDate: undefined, dependencies: [], order: 0 },
      { title: 'Core concepts mastered', dueDate: undefined, dependencies: [], order: 1 },
      { title: 'Practice projects done', dueDate: undefined, dependencies: [], order: 2 },
      { title: 'Final assessment', dueDate: undefined, dependencies: [], order: 3 },
    ],
    defaultTasks: [
      { title: 'Complete intro module', status: 'Todo', dependencies: [], order: 0 },
      { title: 'Read core materials', status: 'Todo', dependencies: [], order: 1 },
      { title: 'Practice exercises', status: 'Todo', dependencies: [], order: 2 },
      { title: 'Build mini project', status: 'Todo', dependencies: [], order: 3 },
      { title: 'Take practice test', status: 'Todo', dependencies: [], order: 4 },
    ],
  },
]
