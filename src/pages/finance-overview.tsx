import { Link } from 'react-router-dom'
import { Wallet, TrendingUp, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const chartData = [
  { month: 'Jan', balance: 4200 },
  { month: 'Feb', balance: 3800 },
  { month: 'Mar', balance: 4500 },
  { month: 'Apr', balance: 4100 },
  { month: 'May', balance: 4800 },
]

export function FinanceOverviewPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Finance</h1>
        <p className="mt-1 text-muted-foreground">
          Balances, forecasts, and anomaly alerts
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,832</div>
            <p className="text-xs text-muted-foreground">Across 2 accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Budget health
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Good</div>
            <p className="text-xs text-muted-foreground">Within limits</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Anomalies
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Needs review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming bills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$320</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cashflow forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="cashflow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgb(255 212 0)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="rgb(255 212 0)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="rgb(255 212 0)"
                      fill="url(#cashflow)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardContent className="flex flex-col gap-2">
              <Link to="/dashboard/history">
                <Button variant="outline" className="w-full justify-start">
                  Order & transaction history
                </Button>
              </Link>
              <Link to="/dashboard/finance/budget">
                <Button variant="outline" className="w-full justify-start">
                  Budget planner
                </Button>
              </Link>
              <Link to="/dashboard/finance/accounts">
                <Button variant="outline" className="w-full justify-start">
                  Link account
                </Button>
              </Link>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
