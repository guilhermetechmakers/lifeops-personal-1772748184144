/**
 * Admin Moderation - Full moderation queue page.
 */

import { ContentModerationQueue } from '@/components/admin/content-moderation-queue'

export function AdminModerationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Content Moderation</h1>
        <p className="text-muted-foreground mt-1">
          Review and manage flagged content
        </p>
      </div>
      <ContentModerationQueue />
    </div>
  )
}
