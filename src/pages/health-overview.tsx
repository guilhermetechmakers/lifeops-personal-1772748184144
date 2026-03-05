import { Link } from 'react-router-dom'
import { Activity, Heart, Moon, Footprints } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function HealthOverviewPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Health</h1>
        <p className="mt-1 text-muted-foreground">
          Workouts, nutrition, and recovery
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Steps today
            </CardTitle>
            <Footprints className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,432</div>
            <p className="text-xs text-muted-foreground">Goal: 10,000</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              HRV
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52 ms</div>
            <p className="text-xs text-muted-foreground">Recovery: Good</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sleep
            </CardTitle>
            <Moon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7h 12m</div>
            <p className="text-xs text-muted-foreground">Last night</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Workouts
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's plan</CardTitle>
            <CardContent>
              <p className="text-muted-foreground">
                Upper body strength • 45 min
              </p>
              <Button variant="outline" className="mt-4">
                Start workout
              </Button>
            </CardContent>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardContent className="flex flex-col gap-2">
              <Link to="/dashboard/health/training">
                <Button variant="outline" className="w-full justify-start">
                  Training plan builder
                </Button>
              </Link>
              <Link to="/dashboard/health/meals">
                <Button variant="outline" className="w-full justify-start">
                  Meal planner
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                Connect devices
              </Button>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
