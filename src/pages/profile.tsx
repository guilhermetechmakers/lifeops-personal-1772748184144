import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function ProfilePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Account personalization and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile card</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                  JD
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">John Doe</p>
                <p className="text-muted-foreground">john@example.com</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Change avatar
                </Button>
              </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" defaultValue="America/New_York" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" defaultValue="USD" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="units">Units</Label>
                <Input id="units" defaultValue="Imperial" />
              </div>
            </div>
            <Button>Save preferences</Button>
        </CardContent>
      </Card>
    </div>
  )
}
