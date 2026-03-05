/**
 * PaymentMethodForm - Secure card entry, wallet options
 * PCI-compliant: tokenize only, never store raw card data
 * LifeOps Personal Checkout
 */

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CreditCard, Wallet } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const cardSchema = z.object({
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .refine(
      (val) => /^\d{13,19}$/.test(val.replace(/\s/g, '')),
      'Invalid card number (13-19 digits)'
    ),
  expiry: z
    .string()
    .min(1, 'Expiry is required')
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY format'),
  cvc: z
    .string()
    .min(1, 'CVC is required')
    .refine((val) => /^\d{3,4}$/.test(val ?? ''), 'Invalid CVC (3-4 digits)'),
})

export type CardFormData = z.infer<typeof cardSchema>

export interface PaymentMethodFormProps {
  onSubmit: (data: CardFormData) => void | Promise<void>
  isLoading?: boolean
  disabled?: boolean
  error?: string | null
  formId?: string
}

/** Format card number with spaces (display only - never store) */
function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 19)
  const groups = digits.match(/.{1,4}/g) ?? []
  return groups.join(' ')
}

/** Format expiry as MM/YY */
function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }
  return digits
}

export function PaymentMethodForm({
  onSubmit,
  isLoading = false,
  disabled = false,
  error: externalError,
  formId = 'payment-form',
}: PaymentMethodFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: { cardNumber: '', expiry: '', cvc: '' },
  })

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
      aria-label="Payment method"
    >
      <div className="flex gap-2" role="group" aria-label="Payment type">
        <button
          type="button"
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3 font-medium transition-all',
            'border-primary bg-primary/10 text-foreground'
          )}
          aria-pressed="true"
        >
          <CreditCard className="h-5 w-5" aria-hidden />
          Card
        </button>
        <button
          type="button"
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-border py-3 font-medium transition-all',
            'text-muted-foreground hover:border-primary/50 hover:bg-accent/30'
          )}
          aria-pressed="false"
          disabled
          aria-label="Wallet payment (coming soon)"
        >
          <Wallet className="h-5 w-5" aria-hidden />
          Wallet
        </button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card number</Label>
        <Controller
          name="cardNumber"
          control={control}
          render={({ field }) => (
            <Input
              id="cardNumber"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              value={formatCardNumber(field.value ?? '')}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 19)
                field.onChange(digits)
              }}
              onBlur={field.onBlur}
              className={cn(errors.cardNumber && 'border-destructive')}
              aria-invalid={!!errors.cardNumber}
              aria-describedby={errors.cardNumber ? 'cardNumber-error' : undefined}
            />
          )}
        />
        {errors.cardNumber && (
          <p id="cardNumber-error" className="text-sm text-destructive" role="alert">
            {errors.cardNumber.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry">Expiry</Label>
          <Controller
            name="expiry"
            control={control}
            render={({ field }) => (
              <Input
                id="expiry"
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                maxLength={5}
                value={field.value ?? ''}
                onChange={(e) => {
                  const formatted = formatExpiry(e.target.value)
                  field.onChange(formatted)
                }}
                onBlur={field.onBlur}
                className={cn(errors.expiry && 'border-destructive')}
                aria-invalid={!!errors.expiry}
                aria-describedby={errors.expiry ? 'expiry-error' : undefined}
              />
            )}
          />
          {errors.expiry && (
            <p id="expiry-error" className="text-sm text-destructive" role="alert">
              {errors.expiry.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvc">CVC</Label>
          <Input
            id="cvc"
            type="password"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            maxLength={4}
            {...register('cvc')}
            className={cn(errors.cvc && 'border-destructive')}
            aria-invalid={!!errors.cvc}
            aria-describedby={errors.cvc ? 'cvc-error' : undefined}
          />
          {errors.cvc && (
            <p id="cvc-error" className="text-sm text-destructive" role="alert">
              {errors.cvc.message}
            </p>
          )}
        </div>
      </div>

      {externalError && (
        <p className="text-sm text-destructive" role="alert">
          {externalError}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Your payment information is encrypted and secure. We never store your full card number.
      </p>
    </form>
  )
}
