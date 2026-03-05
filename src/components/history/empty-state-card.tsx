import { FileQuestion, CreditCard } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export interface EmptyStateCardProps {
  title?: string
  description?: string
  showCheckoutLink?: boolean
  className?: string
}

export function EmptyStateCard({
  title = 'No transaction history yet',
  description = "When you make purchases or manage subscriptions, your invoices, receipts, refunds, and subscription activity will appear here.",
  showCheckoutLink = true,
  className,
}: EmptyStateCardProps) {
  return (
    <Card className={`border-dashed ${className ?? ''}`}>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <FileQuestion className="h-16 w-16 text-muted-foreground" />
        <h3 className="mt-4 font-semibold text-lg">{title}</h3>
        <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
          {description}
        </p>
        {showCheckoutLink && (
          <Link to="/dashboard/checkout">
            <Button
              variant="default"
              className="mt-6 gradient-primary"
            >
              <CreditCard className="h-5 w-5" />
              Manage subscription
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
