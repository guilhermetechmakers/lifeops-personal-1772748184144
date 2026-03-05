import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface VisibilityToggleProps {
  id: string
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function VisibilityToggle({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  className,
}: VisibilityToggleProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-card',
        className
      )}
    >
      <div className="flex-1 space-y-0.5">
        <Label
          htmlFor={id}
          className="cursor-pointer text-sm font-medium text-foreground"
        >
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={`Toggle ${label} visibility`}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  )
}
