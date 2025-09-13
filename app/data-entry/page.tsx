"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  DatabaseIcon,
  UploadIcon,
  MapPinIcon,
  CalendarIcon,
  ThermometerIcon,
  FlaskConicalIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react"

interface MetalConcentration {
  metal: string
  concentration: string
  unit: string
}

interface SampleData {
  sampleId: string
  location: string
  latitude: string
  longitude: string
  date: string
  time: string
  depth: string
  ph: string
  temperature: string
  notes: string
  metals: MetalConcentration[]
}

export default function DataEntryPage() {
  const [activeTab, setActiveTab] = useState("manual")
  const [sampleData, setSampleData] = useState<SampleData>({
    sampleId: "",
    location: "",
    latitude: "",
    longitude: "",
    date: "",
    time: "",
    depth: "",
    ph: "",
    temperature: "",
    notes: "",
    metals: [
      { metal: "Lead (Pb)", concentration: "", unit: "µg/L" },
      { metal: "Cadmium (Cd)", concentration: "", unit: "µg/L" },
      { metal: "Chromium (Cr)", concentration: "", unit: "µg/L" },
      { metal: "Mercury (Hg)", concentration: "", unit: "µg/L" },
      { metal: "Arsenic (As)", concentration: "", unit: "µg/L" },
    ],
  })
  const [uploadProgress, setUploadProgress] = useState(0)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const addMetalRow = () => {
    setSampleData((prev) => ({
      ...prev,
      metals: [...prev.metals, { metal: "", concentration: "", unit: "µg/L" }],
    }))
  }

  const removeMetalRow = (index: number) => {
    setSampleData((prev) => ({
      ...prev,
      metals: prev.metals.filter((_, i) => i !== index),
    }))
  }

  const updateMetal = (index: number, field: keyof MetalConcentration, value: string) => {
    setSampleData((prev) => ({
      ...prev,
      metals: prev.metals.map((metal, i) => (i === index ? { ...metal, [field]: value } : metal)),
    }))
  }

  const validateForm = () => {
    const errors: string[] = []
    if (!sampleData.sampleId) errors.push("Sample ID is required")
    if (!sampleData.location) errors.push("Location is required")
    if (!sampleData.latitude || !sampleData.longitude) errors.push("Coordinates are required")
    if (!sampleData.date) errors.push("Date is required")

    const hasMetalData = sampleData.metals.some((metal) => metal.concentration)
    if (!hasMetalData) errors.push("At least one metal concentration is required")

    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Sample data submitted:", sampleData)
      // Here you would typically send the data to your backend
      alert("Sample data submitted successfully!")
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Simulate file upload progress
      setUploadProgress(0)
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <DatabaseIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Data Entry</h1>
              <p className="text-sm text-muted-foreground">Input heavy metal concentration data</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual" className="flex items-center space-x-2">
              <FlaskConicalIcon className="w-4 h-4" />
              <span>Manual Entry</span>
            </TabsTrigger>
            <TabsTrigger value="batch" className="flex items-center space-x-2">
              <PlusIcon className="w-4 h-4" />
              <span>Batch Entry</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <UploadIcon className="w-4 h-4" />
              <span>File Upload</span>
            </TabsTrigger>
          </TabsList>

          {/* Manual Entry Tab */}
          <TabsContent value="manual" className="space-y-6">
            {validationErrors.length > 0 && (
              <Alert className="border-destructive/50 bg-destructive/10">
                <AlertCircleIcon className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sample Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CalendarIcon className="w-5 h-5" />
                    <span>Sample Information</span>
                  </CardTitle>
                  <CardDescription>Basic sample metadata and collection details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sampleId">Sample ID *</Label>
                      <Input
                        id="sampleId"
                        placeholder="e.g., WS-2024-001"
                        value={sampleData.sampleId}
                        onChange={(e) => setSampleData((prev) => ({ ...prev, sampleId: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Mumbai, Sector 7"
                        value={sampleData.location}
                        onChange={(e) => setSampleData((prev) => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Collection Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={sampleData.date}
                        onChange={(e) => setSampleData((prev) => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Collection Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={sampleData.time}
                        onChange={(e) => setSampleData((prev) => ({ ...prev, time: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="depth">Depth (m)</Label>
                      <Input
                        id="depth"
                        type="number"
                        placeholder="0.5"
                        value={sampleData.depth}
                        onChange={(e) => setSampleData((prev) => ({ ...prev, depth: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ph">pH Level</Label>
                      <Input
                        id="ph"
                        type="number"
                        step="0.1"
                        placeholder="7.0"
                        value={sampleData.ph}
                        onChange={(e) => setSampleData((prev) => ({ ...prev, ph: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature (°C)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        placeholder="25"
                        value={sampleData.temperature}
                        onChange={(e) => setSampleData((prev) => ({ ...prev, temperature: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional observations or comments..."
                      value={sampleData.notes}
                      onChange={(e) => setSampleData((prev) => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Coordinates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPinIcon className="w-5 h-5" />
                    <span>Geographic Coordinates</span>
                  </CardTitle>
                  <CardDescription>Precise location coordinates for the sample</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude *</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        placeholder="19.0760"
                        value={sampleData.latitude}
                        onChange={(e) => setSampleData((prev) => ({ ...prev, latitude: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude *</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        placeholder="72.8777"
                        value={sampleData.longitude}
                        onChange={(e) => setSampleData((prev) => ({ ...prev, longitude: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    Pick Location on Map
                  </Button>

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Tip: You can also click on the map to automatically fill coordinates
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Heavy Metal Concentrations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ThermometerIcon className="w-5 h-5" />
                    <span>Heavy Metal Concentrations</span>
                  </div>
                  <Button onClick={addMetalRow} size="sm" variant="outline">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Metal
                  </Button>
                </CardTitle>
                <CardDescription>Enter concentration values for each heavy metal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleData.metals.map((metal, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <Select value={metal.metal} onValueChange={(value) => updateMetal(index, "metal", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select metal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Lead (Pb)">Lead (Pb)</SelectItem>
                            <SelectItem value="Cadmium (Cd)">Cadmium (Cd)</SelectItem>
                            <SelectItem value="Chromium (Cr)">Chromium (Cr)</SelectItem>
                            <SelectItem value="Mercury (Hg)">Mercury (Hg)</SelectItem>
                            <SelectItem value="Arsenic (As)">Arsenic (As)</SelectItem>
                            <SelectItem value="Copper (Cu)">Copper (Cu)</SelectItem>
                            <SelectItem value="Zinc (Zn)">Zinc (Zn)</SelectItem>
                            <SelectItem value="Nickel (Ni)">Nickel (Ni)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Concentration"
                          value={metal.concentration}
                          onChange={(e) => updateMetal(index, "concentration", e.target.value)}
                        />
                      </div>
                      <div className="w-20">
                        <Select value={metal.unit} onValueChange={(value) => updateMetal(index, "unit", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="µg/L">µg/L</SelectItem>
                            <SelectItem value="mg/L">mg/L</SelectItem>
                            <SelectItem value="ppm">ppm</SelectItem>
                            <SelectItem value="ppb">ppb</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {sampleData.metals.length > 1 && (
                        <Button
                          onClick={() => removeMetalRow(index)}
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <Button variant="outline">Save as Draft</Button>
                  <Button onClick={handleSubmit}>
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Submit Sample
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Batch Entry Tab */}
          <TabsContent value="batch" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Batch Sample Entry</CardTitle>
                <CardDescription>Enter multiple samples at once using a structured form</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <PlusIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Batch Entry Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    This feature will allow you to enter multiple samples in a table format
                  </p>
                  <Button variant="outline">Request Early Access</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* File Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Data Import</CardTitle>
                <CardDescription>Upload CSV or Excel files with sample data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <UploadIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload Data File</h3>
                  <p className="text-muted-foreground mb-4">
                    Drag and drop your CSV or Excel file here, or click to browse
                  </p>
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer bg-transparent">
                      Choose File
                    </Button>
                  </Label>
                </div>

                {uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Supported Formats</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• CSV files (.csv)</li>
                      <li>• Excel files (.xlsx, .xls)</li>
                      <li>• Maximum file size: 10MB</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Required Columns</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Sample ID</li>
                      <li>• Location</li>
                      <li>• Latitude, Longitude</li>
                      <li>• Metal concentrations</li>
                    </ul>
                  </div>
                </div>

                <Button className="w-full" disabled={uploadProgress === 0}>
                  <DatabaseIcon className="w-4 h-4 mr-2" />
                  Process Upload
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
