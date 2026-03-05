/**
 * PromoCodeBar - Input + Apply button with valid/invalid feedback
 * LifeOps Personal Checkout
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Tag, Check, X } from 'lucide-react'

export interface PromoCodeBarProps {
  onApply: (code: string) => void | Promise<void>
  appliedCode?: string | null
  discountAmount?: number
  isValid?: boolean
  isApplying?: boolean
  errorMessage?: string | null
  disabled?: boolean
}

export function PromoCodeBar({
  onApply,
  appliedCode,
  discountAmount = 0,
  isValid = false,
  isApplying = false,
  errorMessage,
  disabled = false,
}: PromoCodeBarProps) {
  const [inputValue, setInputValue] = useState('')
  const displayValue = hasApplied ? (appliedCode ?? '') : inputValue

  const handleApply = () => {
    const code = inputValue.trim()
    if (code) {
      onApply(code)
    }
  }

  const hasApplied = !!appliedCode?.trim()
  const showError = !!errorMessage && !hasApplied

  const handleInputChange = (value: string) => {
    if (!hasApplied) setInputValue(value.toUpperCase())
  }

  return (
    <div
      className="space-y-2"
      role="group"
      aria-label="Promo code"
    >
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="text"
            placeholder="Promo code"
            value={displayValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApply())}
            disabled={disabled || hasApplied || isApplying}
            className={cn(
              'pl-10',
              showError && 'border-destructive',
              hasApplied && isValid && 'border-green-500 bg-green-50 dark:bg-green-950/30'
            )}
            aria-invalid={!!showError}
            aria-describedby={
              showError ? 'promo-error' : hasApplied ? 'promo-success' : undefined
            }
          />
          {hasApplied && isValid && (
            <Check
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-600 dark:text-green-400"
              aria-hidden
            />
          )}
          {showError && (
            <X
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive"
              aria-hidden
            />
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleApply}
          disabled={disabled || !inputValue.trim() || hasApplied || isApplying}
          aria-label="Apply promo code"
        >
          {isApplying ? 'Applying...' : hasApplied ? 'Applied' : 'Apply'}
        </Button>
      </div>
      {showError && (
        <p id="promo-error" className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
      {hasApplied && isValid && discountAmount > 0 && (
        <p id="promo-success" className="text-sm text-green-600 dark:text-green-400">
          {appliedCode} applied: -${discountAmount.toFixed(2)}
        </p>
      )}
    </div>
  )
}
