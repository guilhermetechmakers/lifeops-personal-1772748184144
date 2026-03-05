import { Bell, Undo2, Eye, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const notifications = [
  { id: 1, type: 'ai', text: 'AI suggested 3 tasks for "Q1 Launch"', time: '2h ago', unread: true },
  { id: 2, type: 'finance', text: 'Budget anomaly: $120 at Coffee Shop', time: '5h ago', unread: true },
  { id: 3, type: 'content', text: 'Content "Blog Post" scheduled for tomorrow', time: '1d ago', unread: false },
  { id: 4, type: 'health', text: 'Workout reminder: Upper body today', time: '2d ago', unread: false },
]

export function NotificationsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Notifications</h1>
        <p className="mt-1 text-muted-foreground">
          AI actions, schedules, and alerts
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="default">All</Button>
        <Button variant="outline">Unread</Button>
        <Button variant="outline">AI</Button>
        <Button variant="outline">Finance</Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <Button variant="ghost" size="sm">Settings</Button>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`flex items-center justify-between py-4 ${n.unread ? 'bg-primary/5' : ''}`}
              >
                <div className="flex-1">
                  <p className="font-medium">{n.text}</p>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {n.time}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Undo2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
