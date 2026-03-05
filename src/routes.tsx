import { createBrowserRouter, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { AdminAuthGuard, AdminDashboardShell } from '@/components/admin'
import { LandingPage } from '@/pages/landing'
import { LoginPage } from '@/pages/login'
import { SignupPage } from '@/pages/signup'
import { ForgotPasswordPage } from '@/pages/forgot-password'
import { VerifyEmailPage } from '@/pages/verify-email'
import { OnboardingPage } from '@/pages/onboarding'
import { DashboardPage } from '@/pages/dashboard'
import { ProjectsListPage } from '@/pages/projects-list'
import { ProjectDetailPage } from '@/pages/project-detail'
import { ProjectCreatePage } from '@/pages/project-create'
import { ProjectEditPage } from '@/pages/project-edit'
import { ContentLibraryPage } from '@/pages/content-library'
import { ContentEditorPage } from '@/pages/content-editor'
import { FinanceOverviewPage } from '@/pages/finance-overview'
import { HealthOverviewPage } from '@/pages/health-overview'
import { PlaceholderPage } from '@/pages/placeholder'
import { NotificationsPage } from '@/pages/notifications'
import { SettingsPage } from '@/pages/settings'
import { ProfilePage } from '@/pages/profile'
import { AboutPage } from '@/pages/about'
import { AboutHelpPage } from '@/pages/about-help'
import { CheckoutPage } from '@/pages/checkout'
import { HistoryPage } from '@/pages/history'
import { NotFoundPage } from '@/pages/not-found'
import { LegalPage } from '@/pages/legal'
import { AdminOverviewPage } from '@/pages/admin-overview'
import { AdminUserManagementPage } from '@/pages/admin-user-management'
import { ContentModerationQueue, SystemAlertsPanel } from '@/components/admin'

const privacyContent = `Privacy Policy

We collect and use your data to provide LifeOps services. We do not sell your data. You can export or delete your data at any time.`
const termsContent = `Terms of Service

By using LifeOps, you agree to these terms. We provide the service as-is. You are responsible for your account security.`

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/verify-email', element: <VerifyEmailPage /> },
  { path: '/onboarding', element: <OnboardingPage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/about-help', element: <AboutHelpPage /> },
  { path: '/privacy', element: <LegalPage title="Privacy Policy" content={privacyContent} /> },
  { path: '/terms', element: <LegalPage title="Terms of Service" content={termsContent} /> },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'projects', element: <ProjectsListPage /> },
      { path: 'projects/new', element: <ProjectCreatePage /> },
      { path: 'projects/create', element: <ProjectCreatePage /> },
      { path: 'projects/:id/edit', element: <ProjectEditPage /> },
      { path: 'projects/:id', element: <ProjectDetailPage /> },
      { path: 'content', element: <ContentLibraryPage /> },
      { path: 'content/new', element: <ContentEditorPage /> },
      { path: 'content/:id', element: <ContentEditorPage /> },
      { path: 'finance', element: <FinanceOverviewPage /> },
      { path: 'finance/transactions', element: <PlaceholderPage title="Transactions" description="Transaction list and categorization" /> },
      { path: 'finance/budget', element: <PlaceholderPage title="Budget Planner" description="Create and manage budgets" /> },
      { path: 'finance/accounts', element: <PlaceholderPage title="Accounts & Linking" description="Link external accounts" /> },
      { path: 'health', element: <HealthOverviewPage /> },
      { path: 'health/training', element: <PlaceholderPage title="Training Plan Builder" description="Create training programs" /> },
      { path: 'health/meals', element: <PlaceholderPage title="Meal Planner" description="Meal plans and nutrition" /> },
      { path: 'health/workout', element: <PlaceholderPage title="Log Workout" description="Log your workout" /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'finance/history', element: <HistoryPage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <AdminAuthGuard>
        <AdminDashboardShell />
      </AdminAuthGuard>
    ),
    children: [
      { index: true, element: <AdminOverviewPage /> },
      { path: 'users', element: <AdminUserManagementPage /> },
      { path: 'moderation', element: <ContentModerationQueue /> },
      { path: 'alerts', element: <SystemAlertsPanel /> },
    ],
  },
  { path: '/404', element: <NotFoundPage /> },
  { path: '*', element: <Navigate to="/404" replace /> },
])
