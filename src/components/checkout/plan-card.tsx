/**
 * PlanCard - Displays plan name, benefits, price, cadence, select action
 * LifeOps Personal Checkout - Runtime-safe
 */

import type { Plan } from '@/types/checkout'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export interface PlanCardProps {
  plan: Plan
  isSelected: boolean
  onSelect: () => void
  currentPlanId?: string | null
  disabled?: boolean
}

export function PlanCard({
  plan,
  isSelected,
  onSelect,
  currentPlanId,
  disabled = false,
}: PlanCardProps) {
  const benefits = Array.isArray(plan?.benefits) ? plan.benefits : []
  const isCurrent = currentPlanId === plan?.id
  const cadenceLabel =
    plan?.cadence === 'yearly'
      ? '/year'
      : '/month'

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={isSelected}
      aria-label={`Select ${plan?.name ?? 'plan'} - $${plan?.price ?? 0}${cadenceLabel}`}
      className={cn(
        'group relative w-full rounded-2xl border-2 p-5 text-left transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60',
        isSelected
          ? 'border-primary bg-primary/10 shadow-card'
          : 'border-border bg-card hover:border-primary/50'
      )}
    >
      {isCurrent && (
        <span className="absolute right-4 top-4 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary-foreground">
          Current
        </span>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-foreground">
            {plan?.name ?? 'Plan'}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground capitalize">
            {plan?.cadence ?? 'monthly'} billing
          </p>
        </div>
        <div className="flex items-baseline gap-1 shrink-0">
          <span className="font-bold text-xl text-foreground">
            ${plan?.price ?? 0}
          </span>
          <span className="text-sm text-muted-foreground">{cadenceLabel}</span>
        </div>
      </div>
      {benefits.length > 0 && (
        <ul className="mt-4 space-y-2" role="list">
          {benefits.map((benefit, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Check
                className="h-4 w-4 shrink-0 text-primary"
                aria-hidden
              />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      )}
      <div
        className={cn(
          'mt-4 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
          isSelected
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border group-hover:border-primary/50'
        )}
        aria-hidden
      >
        {isSelected && <Check className="h-4 w-4" />}
      </div>
    </button>
  )
}
