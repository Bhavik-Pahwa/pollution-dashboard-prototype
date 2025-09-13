import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  DropletIcon,
  AlertTriangleIcon,
  TrendingUpIcon,
  MapPinIcon,
  CalculatorIcon,
  FileTextIcon,
  DatabaseIcon,
  BarChart3Icon,
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <DropletIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Heavy Metal Pollution Index Calculator</h1>
                <p className="text-sm text-muted-foreground">Environmental Monitoring System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                System Online
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Alert Section */}
        <div className="mb-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangleIcon className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Critical Alert</AlertTitle>
            <AlertDescription className="text-red-700">
              High lead concentration detected in Sector 7 (Mumbai). Immediate attention required.
            </AlertDescription>
          </Alert>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Samples</CardTitle>
              <DatabaseIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-sm text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Areas</CardTitle>
              <AlertTriangleIcon className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">23</div>
              <p className="text-sm text-muted-foreground">Requires immediate action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average HPI</CardTitle>
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">67.3</div>
              <p className="text-sm text-muted-foreground">Moderate pollution level</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Locations Monitored</CardTitle>
              <MapPinIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-sm text-muted-foreground">Across 12 states</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pollution Level Indicators */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Current Pollution Levels</CardTitle>
              <CardDescription>Heavy metal concentration by type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Lead (Pb)</span>
                  <span className="text-sm text-muted-foreground">85 µg/L</span>
                </div>
                <Progress value={85} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Safe: 0-15</span>
                  <span className="text-destructive">Critical: &gt;50</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cadmium (Cd)</span>
                  <span className="text-sm text-muted-foreground">12 µg/L</span>
                </div>
                <Progress value={40} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Safe: 0-5</span>
                  <span>Moderate: 5-15</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Chromium (Cr)</span>
                  <span className="text-sm text-muted-foreground">28 µg/L</span>
                </div>
                <Progress value={56} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Safe: 0-25</span>
                  <span className="text-orange-600">High: 25-50</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Mercury (Hg)</span>
                  <span className="text-sm text-muted-foreground">3.2 µg/L</span>
                </div>
                <Progress value={32} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Safe: 0-2</span>
                  <span>Moderate: 2-10</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Access key features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/data-entry">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <DatabaseIcon className="mr-2 h-4 w-4" />
                  Add Sample Data
                </Button>
              </Link>
              <Link href="/calculator">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <CalculatorIcon className="mr-2 h-4 w-4" />
                  Calculate Index
                </Button>
              </Link>
              <Link href="/map">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <MapPinIcon className="mr-2 h-4 w-4" />
                  View Map
                </Button>
              </Link>
              <Link href="/reports">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </Link>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <BarChart3Icon className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest samples and calculations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Sample #2847 - Mumbai, Sector 7</p>
                    <p className="text-xs text-muted-foreground">HPI: 89.2 (Critical)</p>
                  </div>
                </div>
                <Badge variant="destructive">Critical</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Sample #2846 - Delhi, Industrial Area</p>
                    <p className="text-xs text-muted-foreground">HPI: 67.8 (High)</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  High
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Sample #2845 - Bangalore, Tech Park</p>
                    <p className="text-xs text-muted-foreground">HPI: 23.4 (Safe)</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Safe
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
