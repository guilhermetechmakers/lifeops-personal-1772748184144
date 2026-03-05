import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CURRENCIES } from '@/data/currencies'
import { cn } from '@/lib/utils'

export interface CurrencySelectorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function CurrencySelector({
  value,
  onChange,
  placeholder = 'Select currency',
  className,
}: CurrencySelectorProps) {
  const list = CURRENCIES ?? []

  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger className={cn('rounded-xl', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {list.map((c) => (
          <SelectItem key={c.code} value={c.code} className="rounded-lg">
            <span className="flex items-center gap-2">
              <span className="font-medium">{c.symbol}</span>
              <span>{c.code}</span>
              <span className="text-muted-foreground">— {c.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
