/**
 * Mock data for About / Help page.
 * Replace with API calls when backend is connected.
 */

import type { Article, FAQ, Guide, StatusItem } from '@/types/about-help'

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Getting Started with LifeOps Personal',
    excerpt: 'Learn the basics of setting up your account and navigating the dashboard.',
    content: '',
    category: 'Onboarding',
    tags: ['getting-started', 'setup', 'dashboard'],
    updatedAt: '2025-03-01T12:00:00Z',
  },
  {
    id: 'art-2',
    title: 'Linking Your Bank Accounts',
    excerpt: 'Securely connect your bank accounts for automatic transaction sync and insights.',
    content: '',
    category: 'Finance',
    tags: ['bank', 'linking', 'finance', 'security'],
    updatedAt: '2025-02-28T10:00:00Z',
  },
  {
    id: 'art-3',
    title: 'Publishing Content to Social Channels',
    excerpt: 'Schedule and publish content across your connected social media platforms.',
    content: '',
    category: 'Content',
    tags: ['publishing', 'social', 'content', 'scheduling'],
    updatedAt: '2025-02-27T14:00:00Z',
  },
  {
    id: 'art-4',
    title: 'Understanding Agent Permissions',
    excerpt: 'How to configure and manage what AI agents can suggest and execute on your behalf.',
    content: '',
    category: 'Agents',
    tags: ['agents', 'permissions', 'AI', 'explainability'],
    updatedAt: '2025-02-26T09:00:00Z',
  },
  {
    id: 'art-5',
    title: 'Project Milestones and Kanban Boards',
    excerpt: 'Organize projects with milestones and drag-and-drop Kanban task boards.',
    content: '',
    category: 'Projects',
    tags: ['projects', 'milestones', 'kanban', 'tasks'],
    updatedAt: '2025-02-25T16:00:00Z',
  },
  {
    id: 'art-6',
    title: 'Health Module: Training Plans',
    excerpt: 'Create and follow personalized training plans with workout logging.',
    content: '',
    category: 'Health',
    tags: ['health', 'training', 'workout', 'fitness'],
    updatedAt: '2025-02-24T11:00:00Z',
  },
]

export const MOCK_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How do I get started with LifeOps?',
    answer:
      'Sign up for an account, complete the onboarding flow to set your preferences, and explore the dashboard. We recommend starting with Projects to create your first project and familiarize yourself with the AI suggestions.',
    category: 'Onboarding',
  },
  {
    id: 'faq-2',
    question: 'Is my bank data secure when linking accounts?',
    answer:
      'Yes. We use bank-grade encryption and never store your login credentials. Our integration partners are PCI-compliant and we only access read-only transaction data for insights and categorization.',
    category: 'Finance',
  },
  {
    id: 'faq-3',
    question: 'Can I publish to multiple social channels at once?',
    answer:
      'Yes. The Content module lets you create content once and schedule it for multiple platforms. Connect your accounts in Settings > Integrations, then use the Content Editor to publish across channels.',
    category: 'Content',
  },
  {
    id: 'faq-4',
    question: 'What can AI agents do without my approval?',
    answer:
      'Agents only suggest actions. You must approve each action before it executes. Configure granular permissions in Settings > Agent Permissions to control what agents can propose.',
    category: 'Agents',
  },
  {
    id: 'faq-5',
    question: 'How do I cancel or change my subscription?',
    answer:
      'Go to Settings > Subscription to view your plan and billing. You can upgrade, downgrade, or cancel at any time. Changes take effect at the end of your current billing period.',
    category: 'Billing',
  },
  {
    id: 'faq-6',
    question: 'Where can I see explainable AI rationale?',
    answer:
      'Every AI suggestion includes a rationale panel. Click the info icon or expand the suggestion to see why the agent recommended that action. This applies to Projects, Finance, Content, and Health.',
    category: 'Agents',
  },
]

export const MOCK_GUIDES: Guide[] = [
  {
    id: 'guide-1',
    title: 'Projects: Getting Started',
    module: 'Projects',
    steps: [
      { id: 's1', text: 'Create your first project from the Projects dashboard' },
      { id: 's2', text: 'Add milestones and break them into tasks' },
      { id: 's3', text: 'Use the Kanban board to track progress' },
      { id: 's4', text: 'Review AI suggestions and approve actions' },
    ],
  },
  {
    id: 'guide-2',
    title: 'Content: Getting Started',
    module: 'Content',
    steps: [
      { id: 's1', text: 'Connect your social accounts in Settings' },
      { id: 's2', text: 'Use AI ideation to generate content ideas' },
      { id: 's3', text: 'Create and edit content in the Content Editor' },
      { id: 's4', text: 'Schedule or publish to your channels' },
    ],
  },
  {
    id: 'guide-3',
    title: 'Finance: Getting Started',
    module: 'Finance',
    steps: [
      { id: 's1', text: 'Link your bank accounts securely' },
      { id: 's2', text: 'Review and categorize transactions' },
      { id: 's3', text: 'Set up budgets and cashflow forecasts' },
      { id: 's4', text: 'Enable anomaly alerts for unusual spending' },
    ],
  },
  {
    id: 'guide-4',
    title: 'Health: Getting Started',
    module: 'Health',
    steps: [
      { id: 's1', text: 'Create a training plan or use a template' },
      { id: 's2', text: 'Log workouts and track progress' },
      { id: 's3', text: 'Connect wearables for automatic sync' },
      { id: 's4', text: 'Use the meal planner for nutrition goals' },
    ],
  },
]

export const MOCK_STATUS: StatusItem[] = [
  {
    id: 'status-1',
    service: 'Core API',
    status: 'operational',
    updatedAt: new Date().toISOString(),
    message: 'All systems normal',
  },
  {
    id: 'status-2',
    service: 'Bank Linking',
    status: 'operational',
    updatedAt: new Date().toISOString(),
    message: 'Connections stable',
  },
  {
    id: 'status-3',
    service: 'AI Agents',
    status: 'operational',
    updatedAt: new Date().toISOString(),
    message: 'Suggestions and explainability active',
  },
]
