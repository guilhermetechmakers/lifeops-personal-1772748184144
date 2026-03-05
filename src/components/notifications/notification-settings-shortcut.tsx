import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface NotificationSettingsShortcutProps {
  onClick: () => void
  label?: string
}

export function NotificationSettingsShortcut({
  onClick,
  label = 'Notification preferences',
}: NotificationSettingsShortcutProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="gap-2 transition-transform hover:scale-[1.02]"
      aria-label={label}
    >
      <Settings className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  )
}
