import { cn } from '@/lib/utils'

export interface ValidationMessageProps {
  message: string
  type?: 'error' | 'success' | 'hint'
  id?: string
  className?: string
}

export function ValidationMessage({
  message,
  type = 'error',
  id,
  className,
}: ValidationMessageProps) {
  return (
    <p
      id={id}
      role={type === 'error' ? 'alert' : undefined}
      className={cn(
        'text-sm',
        type === 'error' && 'text-destructive',
        type === 'success' && 'text-green-600 dark:text-green-400',
        type === 'hint' && 'text-muted-foreground',
        className
      )}
    >
      {message}
    </p>
  )
}
