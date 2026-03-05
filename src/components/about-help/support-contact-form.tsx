import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Paperclip, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { submitSupportContact } from '@/api/about-help'
import { cn } from '@/lib/utils'

const MAX_ATTACHMENTS = 5
const MAX_TOTAL_SIZE_MB = 20
const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024
const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  module: z.string().optional(),
  priority: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export interface SupportContactFormProps {
  className?: string
}

export function SupportContactForm({ className }: SupportContactFormProps) {
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      module: '',
      priority: 'normal',
    },
  })

  const moduleValue = watch('module')
  const priorityValue = watch('priority')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length === 0) return

    const current = attachments
    const totalCount = current.length + files.length
    if (totalCount > MAX_ATTACHMENTS) {
      toast.error(`Maximum ${MAX_ATTACHMENTS} attachments allowed`)
      return
    }

    const totalSize = current.reduce((s, f) => s + f.size, 0) + files.reduce((s, f) => s + f.size, 0)
    if (totalSize > MAX_TOTAL_SIZE_BYTES) {
      toast.error(`Total attachment size must not exceed ${MAX_TOTAL_SIZE_MB}MB`)
      return
    }

    const valid = files.filter((f) => ACCEPTED_TYPES.includes(f.type))
    if (valid.length < files.length) {
      toast.error('Some files were rejected. Accepted: images, PDF, Word docs.')
    }

    setAttachments((prev) => [...prev, ...valid].slice(0, MAX_ATTACHMENTS))
    e.target.value = ''
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const result = await submitSupportContact({
        ...data,
        attachments: attachments.length > 0 ? attachments : undefined,
        context: {
          page: 'about-help',
          timestamp: new Date().toISOString(),
        },
      })

      if (result?.success) {
        toast.success(result.message ?? 'Message sent successfully')
        reset()
        setAttachments([])
      } else {
        toast.error(result?.message ?? 'Failed to send message')
      }
    } catch {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-6', className)}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="support-name">Name *</Label>
          <Input
            id="support-name"
            placeholder="Your name"
            {...register('name')}
            className={errors.name ? 'border-destructive' : ''}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'support-name-error' : undefined}
          />
          {errors.name && (
            <p id="support-name-error" className="text-sm text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="support-email">Email *</Label>
          <Input
            id="support-email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            className={errors.email ? 'border-destructive' : ''}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'support-email-error' : undefined}
          />
          {errors.email && (
            <p id="support-email-error" className="text-sm text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="support-subject">Subject *</Label>
        <Input
          id="support-subject"
          placeholder="Brief description of your issue"
          {...register('subject')}
          className={errors.subject ? 'border-destructive' : ''}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'support-subject-error' : undefined}
        />
        {errors.subject && (
          <p id="support-subject-error" className="text-sm text-destructive">
            {errors.subject.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="support-module">Module (optional)</Label>
          <Select
            value={moduleValue ?? ''}
            onValueChange={(v) => setValue('module', v)}
          >
            <SelectTrigger id="support-module" aria-label="Related module">
              <SelectValue placeholder="Select module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              <SelectItem value="Projects">Projects</SelectItem>
              <SelectItem value="Content">Content</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="support-priority">Priority (optional)</Label>
          <Select
            value={priorityValue ?? 'normal'}
            onValueChange={(v) => setValue('priority', v)}
          >
            <SelectTrigger id="support-priority" aria-label="Priority">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="support-message">Message *</Label>
        <Textarea
          id="support-message"
          placeholder="Describe your issue or question in detail..."
          rows={5}
          {...register('message')}
          className={errors.message ? 'border-destructive' : ''}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'support-message-error' : undefined}
        />
        {errors.message && (
          <p id="support-message-error" className="text-sm text-destructive">
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Attachments (optional, max {MAX_ATTACHMENTS} files, {MAX_TOTAL_SIZE_MB}MB total)</Label>
        <div className="flex flex-wrap items-center gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="sr-only"
              aria-label="Add attachments"
            />
            <span className="inline-flex items-center gap-2 rounded-xl border border-input bg-card px-4 py-2 text-sm transition-colors hover:bg-muted/50">
              <Paperclip className="h-4 w-4" />
              Add files
            </span>
          </label>
          {attachments.map((file, i) => (
            <span
              key={`${file.name}-${i}`}
              className="inline-flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-xs"
            >
              {file.name}
              <button
                type="button"
                onClick={() => removeAttachment(i)}
                className="rounded p-0.5 hover:bg-muted-foreground/20"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        className="gradient-primary text-primary-foreground w-full sm:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send message'}
      </Button>
    </form>
  )
}
