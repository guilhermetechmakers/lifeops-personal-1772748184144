import { useRef, useState, useCallback } from 'react'
import { Upload, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export interface AvatarUploaderProps {
  value?: string | null
  fallbackInitials?: string
  onUpload?: (file: File) => Promise<string | null>
  disabled?: boolean
  className?: string
}

export function AvatarUploader({
  value,
  fallbackInitials = '??',
  onUpload,
  disabled = false,
  className,
}: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = useCallback(() => {
    if (disabled || isLoading) return
    inputRef.current?.click()
  }, [disabled, isLoading])

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      setError(null)
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('Please use JPEG, PNG, WebP, or GIF')
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        setError('Image must be under 2MB')
        return
      }

      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
      setIsLoading(true)

      try {
        if (onUpload) {
          const url = await onUpload(file)
          if (url) setPreview(null)
        }
      } catch {
        setError('Upload failed')
      } finally {
        setIsLoading(false)
        URL.revokeObjectURL(objectUrl)
        e.target.value = ''
      }
    },
    [onUpload]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer?.files?.[0]
      if (!file) return
      const fakeEvent = {
        target: { files: [file], value: '' },
      } as unknown as React.ChangeEvent<HTMLInputElement>
      void handleChange(fakeEvent)
    },
    [handleChange]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const displayUrl = preview ?? value ?? null
  const initials = fallbackInitials ?? '??'

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <button
        type="button"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        disabled={disabled || isLoading}
        className={cn(
          'group relative rounded-full transition-all duration-200',
          'hover:ring-2 hover:ring-primary hover:ring-offset-2',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          (disabled || isLoading) && 'cursor-not-allowed opacity-60'
        )}
        aria-label="Upload avatar"
      >
        <Avatar className="h-24 w-24 rounded-full border-2 border-border transition-shadow duration-200 group-hover:shadow-card">
          <AvatarImage src={displayUrl ?? undefined} alt="Avatar" />
          <AvatarFallback className="bg-muted text-lg font-semibold">
            {initials ? <span>{initials}</span> : <User className="h-10 w-10" />}
          </AvatarFallback>
        </Avatar>
        {!disabled && (
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100',
              isLoading && 'opacity-100'
            )}
          >
            {isLoading ? (
              <div className="h-6 w-6 animate-pulse rounded-full bg-white" />
            ) : (
              <Upload className="h-8 w-8 text-white" />
            )}
          </div>
        )}
      </button>
      <p className="text-center text-xs text-muted-foreground">
        Drag & drop or click to upload
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleChange}
        className="sr-only"
        aria-hidden
      />
      {error && (
        <p className="text-center text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
