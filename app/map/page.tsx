"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  MapIcon,
  LayersIcon,
  SearchIcon,
  RulerIcon,
  DraftingCompassIcon as DrawingPinIcon,
  FilterIcon,
  ZoomInIcon,
  ZoomOutIcon,
  LocateIcon,
  SettingsIcon,
} from "lucide-react"

interface SamplePoint {
  id: string
  name: string
  latitude: number
  longitude: number
  hpi: number
  level: "safe" | "moderate" | "high" | "critical"
  metals: {
    lead: number
    cadmium: number
    chromium: number
    mercury: number
    arsenic: number
  }
  date: string
}

const sampleData: SamplePoint[] = [
  {
    id: "WS-001",
    name: "Mumbai, Sector 7",
    latitude: 19.076,
    longitude: 72.8777,
    hpi: 89.2,
    level: "critical",
    metals: { lead: 85, cadmium: 12, chromium: 28, mercury: 3.2, arsenic: 15 },
    date: "2024-01-15",
  },
  {
    id: "WS-002",
    name: "Delhi, Industrial Area",
    latitude: 28.7041,
    longitude: 77.1025,
    hpi: 67.8,
    level: "high",
    metals: { lead: 45, cadmium: 8, chromium: 35, mercury: 2.1, arsenic: 12 },
    date: "2024-01-14",
  },
  {
    id: "WS-003",
    name: "Bangalore, Tech Park",
    latitude: 12.9716,
    longitude: 77.5946,
    hpi: 23.4,
    level: "safe",
    metals: { lead: 8, cadmium: 2, chromium: 12, mercury: 0.8, arsenic: 4 },
    date: "2024-01-13",
  },
  {
    id: "WS-004",
    name: "Chennai, Port Area",
    latitude: 13.0827,
    longitude: 80.2707,
    hpi: 54.6,
    level: "moderate",
    metals: { lead: 32, cadmium: 6, chromium: 22, mercury: 1.5, arsenic: 8 },
    date: "2024-01-12",
  },
  {
    id: "WS-005",
    name: "Kolkata, River Bank",
    latitude: 22.5726,
    longitude: 88.3639,
    hpi: 78.3,
    level: "high",
    metals: { lead: 58, cadmium: 9, chromium: 31, mercury: 2.8, arsenic: 18 },
    date: "2024-01-11",
  },
]

export default function MapPage() {
  const [mapLayer, setMapLayer] = useState("street")
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [showClusters, setShowClusters] = useState(true)
  const [selectedMetal, setSelectedMetal] = useState("hpi")
  const [zoomLevel, setZoomLevel] = useState([8])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPoint, setSelectedPoint] = useState<SamplePoint | null>(null)
  const [filterLevel, setFilterLevel] = useState("all")
  const [measurementMode, setMeasurementMode] = useState(false)
  const [drawingMode, setDrawingMode] = useState(false)

  const getLevelColor = (level: string) => {
    switch (level) {
      case "safe":
        return "bg-green-500"
      case "moderate":
        return "bg-yellow-500"
      case "high":
        return "bg-orange-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "safe":
        return "bg-green-100 text-green-700 border-green-200"
      case "moderate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "critical":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const filteredData = sampleData.filter((point) => {
    if (filterLevel === "all") return true
    return point.level === filterLevel
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <MapIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Pollution Map</h1>
                <p className="text-sm text-muted-foreground">Interactive contamination visualization</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {filteredData.length} Locations
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar Controls */}
        <div className="w-80 border-r bg-card overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Search */}
            <div className="space-y-2">
              <Label>Search Location</Label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by city, coordinates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Map Controls */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center space-x-2">
                <LayersIcon className="w-4 h-4" />
                <span>Map Layers</span>
              </h3>

              <div className="space-y-2">
                <Label>Base Layer</Label>
                <Select value={mapLayer} onValueChange={setMapLayer}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="street">Street Map</SelectItem>
                    <SelectItem value="satellite">Satellite</SelectItem>
                    <SelectItem value="terrain">Terrain</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Heat Map</Label>
                  <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Cluster Points</Label>
                  <Switch checked={showClusters} onCheckedChange={setShowClusters} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Visualization Metric</Label>
                <Select value={selectedMetal} onValueChange={setSelectedMetal}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hpi">Heavy Metal Pollution Index</SelectItem>
                    <SelectItem value="lead">Lead (Pb)</SelectItem>
                    <SelectItem value="cadmium">Cadmium (Cd)</SelectItem>
                    <SelectItem value="chromium">Chromium (Cr)</SelectItem>
                    <SelectItem value="mercury">Mercury (Hg)</SelectItem>
                    <SelectItem value="arsenic">Arsenic (As)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Zoom Level: {zoomLevel[0]}</Label>
                <Slider value={zoomLevel} onValueChange={setZoomLevel} max={18} min={1} step={1} className="w-full" />
              </div>
            </div>

            <Separator />

            {/* Filters */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center space-x-2">
                <FilterIcon className="w-4 h-4" />
                <span>Filters</span>
              </h3>

              <div className="space-y-2">
                <Label>Pollution Level</Label>
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="safe">Safe</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Tools */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center space-x-2">
                <SettingsIcon className="w-4 h-4" />
                <span>Tools</span>
              </h3>

              <div className="space-y-2">
                <Button
                  variant={measurementMode ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setMeasurementMode(!measurementMode)}
                >
                  <RulerIcon className="w-4 h-4 mr-2" />
                  Measure Distance
                </Button>
                <Button
                  variant={drawingMode ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setDrawingMode(!drawingMode)}
                >
                  <DrawingPinIcon className="w-4 h-4 mr-2" />
                  Draw Area
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <LocateIcon className="w-4 h-4 mr-2" />
                  My Location
                </Button>
              </div>
            </div>

            <Separator />

            {/* Sample Points List */}
            <div className="space-y-4">
              <h3 className="font-semibold">Sample Locations</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredData.map((point) => (
                  <div
                    key={point.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPoint?.id === point.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedPoint(point)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{point.name}</span>
                      <div className={`w-3 h-3 rounded-full ${getLevelColor(point.level)}`}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{point.id}</span>
                      <Badge variant="outline" className={`text-xs ${getLevelBadge(point.level)}`}>
                        HPI: {point.hpi}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          {/* Map Placeholder */}
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-10 space-y-2">
              <div className="bg-card border rounded-lg p-2 space-y-1">
                <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-transparent">
                  <ZoomInIcon className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-transparent">
                  <ZoomOutIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Layer Indicator */}
            <div className="absolute top-4 left-4 z-10">
              <Badge variant="outline" className="bg-card">
                {mapLayer.charAt(0).toUpperCase() + mapLayer.slice(1)} View
              </Badge>
            </div>

            {/* Mock Map with Sample Points */}
            <div className="relative w-full h-full">
              {/* India Map Outline (Simplified) */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600">
                <defs>
                  <pattern id="heatmap" patternUnits="userSpaceOnUse" width="20" height="20">
                    <circle cx="10" cy="10" r="8" fill="rgba(239, 68, 68, 0.1)" />
                  </pattern>
                </defs>

                {/* Simplified India outline */}
                <path
                  d="M200 100 L600 120 L580 180 L620 250 L600 350 L550 420 L480 450 L400 440 L350 400 L300 380 L250 350 L220 300 L200 250 L180 200 Z"
                  fill={showHeatmap ? "url(#heatmap)" : "rgba(59, 130, 246, 0.1)"}
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="2"
                />

                {/* Sample Points */}
                {filteredData.map((point, index) => {
                  // Mock positioning based on approximate coordinates
                  const x = 200 + (point.longitude - 68) * 8
                  const y = 150 + (28 - point.latitude) * 10

                  return (
                    <g key={point.id}>
                      {/* Point Circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r={selectedPoint?.id === point.id ? "12" : "8"}
                        fill={
                          point.level === "critical"
                            ? "#dc2626"
                            : point.level === "high"
                              ? "#ea580c"
                              : point.level === "moderate"
                                ? "#ca8a04"
                                : "#16a34a"
                        }
                        stroke="white"
                        strokeWidth="2"
                        className="cursor-pointer transition-all hover:r-10"
                        onClick={() => setSelectedPoint(point)}
                      />

                      {/* Point Label */}
                      <text
                        x={x}
                        y={y - 15}
                        textAnchor="middle"
                        className="text-xs font-medium fill-gray-700"
                        style={{ fontSize: "10px" }}
                      >
                        {point.id}
                      </text>

                      {/* HPI Value */}
                      <text
                        x={x}
                        y={y + 20}
                        textAnchor="middle"
                        className="text-xs fill-gray-600"
                        style={{ fontSize: "8px" }}
                      >
                        {point.hpi}
                      </text>
                    </g>
                  )
                })}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-card border rounded-lg p-4 space-y-2">
                <h4 className="text-sm font-semibold">Pollution Levels</h4>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs">Safe (0-25)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-xs">Moderate (25-50)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-xs">High (50-75)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs">Critical (&gt;75)</span>
                  </div>
                </div>
              </div>

              {/* Scale */}
              <div className="absolute bottom-4 right-4 bg-card border rounded-lg p-2">
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-1 bg-gray-400"></div>
                  <span className="text-xs">100 km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Point Info Panel */}
          {selectedPoint && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
              <Card className="w-80">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{selectedPoint.name}</CardTitle>
                    <Badge variant="outline" className={getLevelBadge(selectedPoint.level)}>
                      {selectedPoint.level.toUpperCase()}
                    </Badge>
                  </div>
                  <CardDescription>Sample ID: {selectedPoint.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">HPI Value</Label>
                      <div className="text-2xl font-bold">{selectedPoint.hpi}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Collection Date</Label>
                      <div className="text-sm">{selectedPoint.date}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Metal Concentrations (µg/L)</Label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span>Lead:</span>
                        <span className="font-mono">{selectedPoint.metals.lead}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cadmium:</span>
                        <span className="font-mono">{selectedPoint.metals.cadmium}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chromium:</span>
                        <span className="font-mono">{selectedPoint.metals.chromium}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mercury:</span>
                        <span className="font-mono">{selectedPoint.metals.mercury}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Arsenic:</span>
                        <span className="font-mono">{selectedPoint.metals.arsenic}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tool Status */}
          {(measurementMode || drawingMode) && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
              <Badge variant="outline" className="bg-card">
                {measurementMode ? "Measurement Mode Active" : "Drawing Mode Active"} - Click on map to use
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
