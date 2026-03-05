import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

const schema = z.object({
  cardNumber: z.string().min(16, 'Invalid card number'),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, 'MM/YY'),
  cvc: z.string().min(3, 'Invalid CVC'),
})

type FormData = z.infer<typeof schema>

const plans = [
  { id: 'pro', name: 'Pro', price: 19, features: ['Unlimited projects', 'AI suggestions', 'Priority support'] },
  { id: 'creator', name: 'Creator', price: 29, features: ['Everything in Pro', 'Content scheduler', 'Multi-channel'] },
]

export function CheckoutPage() {
  const [plan, setPlan] = useState('pro')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { cardNumber: '', expiry: '', cvc: '' },
  })

  const onSubmit = async () => {
    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 1000))
      toast.success('Payment successful!')
    } catch {
      toast.error('Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedPlan = plans.find((p) => p.id === plan) ?? plans[0]

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Checkout</h1>
        <p className="mt-1 text-muted-foreground">
          Subscription and payment
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {plans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlan(p.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    plan === p.id ? 'border-primary bg-primary/10' : 'border-border'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{p.name}</span>
                    <span className="font-bold">${p.price}/mo</span>
                  </div>
                  <ul className="mt-2 text-sm text-muted-foreground">
                    {p.features.map((f) => (
                      <li key={f}>• {f}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment method</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Card number</Label>
                  <Input
                    placeholder="4242 4242 4242 4242"
                    {...register('cardNumber')}
                    className={errors.cardNumber ? 'border-destructive' : ''}
                  />
                  {errors.cardNumber && (
                    <p className="text-sm text-destructive">{errors.cardNumber.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Expiry</Label>
                    <Input
                      placeholder="MM/YY"
                      {...register('expiry')}
                      className={errors.expiry ? 'border-destructive' : ''}
                    />
                    {errors.expiry && (
                      <p className="text-sm text-destructive">{errors.expiry.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>CVC</Label>
                    <Input
                      placeholder="123"
                      {...register('cvc')}
                      className={errors.cvc ? 'border-destructive' : ''}
                    />
                    {errors.cvc && (
                      <p className="text-sm text-destructive">{errors.cvc.message}</p>
                    )}
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full gradient-primary text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : `Pay $${selectedPlan.price}/mo`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Billing summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{selectedPlan.name} plan</span>
                <span>${selectedPlan.price}/mo</span>
              </div>
              <div className="flex justify-between border-t border-border pt-4">
                <span className="font-medium">Total</span>
                <span className="font-bold">${selectedPlan.price}/mo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
