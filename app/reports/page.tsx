"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  FileTextIcon,
  DownloadIcon,
  CalendarIcon,
  SettingsIcon,
  EyeIcon,
  PlusIcon,
  TrashIcon,
  CopyIcon,
  ClockIcon,
  BarChart3Icon,
  MapPinIcon,
  FlaskConicalIcon,
} from "lucide-react"

interface ReportTemplate {
  id: string
  name: string
  description: string
  type: "summary" | "detailed" | "comparison" | "trend"
  sections: string[]
  estimatedPages: number
}

interface ReportConfig {
  templateId: string
  title: string
  dateRange: {
    start: string
    end: string
  }
  locations: string[]
  metals: string[]
  includeCharts: boolean
  includeMap: boolean
  includeRawData: boolean
  format: "pdf" | "excel" | "word"
}

const reportTemplates: ReportTemplate[] = [
  {
    id: "executive-summary",
    name: "Executive Summary",
    description: "High-level overview for management and stakeholders",
    type: "summary",
    sections: ["Key Findings", "Risk Assessment", "Recommendations", "Action Items"],
    estimatedPages: 3,
  },
  {
    id: "technical-detailed",
    name: "Technical Detailed Report",
    description: "Comprehensive analysis with all data and calculations",
    type: "detailed",
    sections: ["Methodology", "Data Analysis", "Index Calculations", "Statistical Analysis", "Conclusions"],
    estimatedPages: 15,
  },
  {
    id: "location-comparison",
    name: "Location Comparison",
    description: "Compare pollution levels across multiple locations",
    type: "comparison",
    sections: ["Location Overview", "Comparative Analysis", "Ranking", "Hotspot Identification"],
    estimatedPages: 8,
  },
  {
    id: "trend-analysis",
    name: "Trend Analysis",
    description: "Historical trends and temporal patterns",
    type: "trend",
    sections: ["Time Series Analysis", "Seasonal Patterns", "Trend Projections", "Forecasting"],
    estimatedPages: 12,
  },
]

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("generate")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    templateId: "",
    title: "",
    dateRange: { start: "", end: "" },
    locations: [],
    metals: ["lead", "cadmium", "chromium", "mercury", "arsenic"],
    includeCharts: true,
    includeMap: true,
    includeRawData: false,
    format: "pdf",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [scheduledReports, setScheduledReports] = useState([
    {
      id: "1",
      name: "Monthly Executive Summary",
      template: "Executive Summary",
      frequency: "Monthly",
      nextRun: "2024-02-01",
      status: "Active",
    },
    {
      id: "2",
      name: "Quarterly Technical Report",
      template: "Technical Detailed Report",
      frequency: "Quarterly",
      nextRun: "2024-03-01",
      status: "Active",
    },
  ])

  const handleGenerateReport = () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulate report generation
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case "summary":
        return <BarChart3Icon className="w-5 h-5" />
      case "detailed":
        return <FlaskConicalIcon className="w-5 h-5" />
      case "comparison":
        return <MapPinIcon className="w-5 h-5" />
      case "trend":
        return <ClockIcon className="w-5 h-5" />
      default:
        return <FileTextIcon className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <FileTextIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Reports</h1>
              <p className="text-sm text-muted-foreground">Generate and manage pollution analysis reports</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate" className="flex items-center space-x-2">
              <FileTextIcon className="w-4 h-4" />
              <span>Generate Report</span>
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4" />
              <span>Scheduled Reports</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <ClockIcon className="w-4 h-4" />
              <span>Report History</span>
            </TabsTrigger>
          </TabsList>

          {/* Generate Report Tab */}
          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Template Selection */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Report Template</CardTitle>
                    <CardDescription>Choose a pre-built template or create a custom report</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reportTemplates.map((template) => (
                        <div
                          key={template.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedTemplate === template.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                          }`}
                          onClick={() => {
                            setSelectedTemplate(template.id)
                            setReportConfig((prev) => ({ ...prev, templateId: template.id }))
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg">
                              {getTemplateIcon(template.type)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">{template.name}</h3>
                              <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-xs">
                                  ~{template.estimatedPages} pages
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {template.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Report Configuration */}
                {selectedTemplate && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Report Configuration</CardTitle>
                      <CardDescription>Customize your report parameters</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Report Title</Label>
                        <Input
                          placeholder="Enter report title..."
                          value={reportConfig.title}
                          onChange={(e) => setReportConfig((prev) => ({ ...prev, title: e.target.value }))}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="date"
                            value={reportConfig.dateRange.start}
                            onChange={(e) =>
                              setReportConfig((prev) => ({
                                ...prev,
                                dateRange: { ...prev.dateRange, start: e.target.value },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="date"
                            value={reportConfig.dateRange.end}
                            onChange={(e) =>
                              setReportConfig((prev) => ({
                                ...prev,
                                dateRange: { ...prev.dateRange, end: e.target.value },
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Export Format</Label>
                        <Select
                          value={reportConfig.format}
                          onValueChange={(value: "pdf" | "excel" | "word") =>
                            setReportConfig((prev) => ({ ...prev, format: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF Document</SelectItem>
                            <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                            <SelectItem value="word">Word Document</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <Label>Include Sections</Label>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Charts and Visualizations</Label>
                            <Switch
                              checked={reportConfig.includeCharts}
                              onCheckedChange={(checked) =>
                                setReportConfig((prev) => ({ ...prev, includeCharts: checked }))
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Map Visualizations</Label>
                            <Switch
                              checked={reportConfig.includeMap}
                              onCheckedChange={(checked) =>
                                setReportConfig((prev) => ({ ...prev, includeMap: checked }))
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Raw Data Tables</Label>
                            <Switch
                              checked={reportConfig.includeRawData}
                              onCheckedChange={(checked) =>
                                setReportConfig((prev) => ({ ...prev, includeRawData: checked }))
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Heavy Metals to Include</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {["lead", "cadmium", "chromium", "mercury", "arsenic", "copper"].map((metal) => (
                            <div key={metal} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={metal}
                                checked={reportConfig.metals.includes(metal)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setReportConfig((prev) => ({
                                      ...prev,
                                      metals: [...prev.metals, metal],
                                    }))
                                  } else {
                                    setReportConfig((prev) => ({
                                      ...prev,
                                      metals: prev.metals.filter((m) => m !== metal),
                                    }))
                                  }
                                }}
                                className="rounded"
                              />
                              <Label htmlFor={metal} className="text-sm capitalize">
                                {metal}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Preview and Actions */}
              <div className="space-y-6">
                {selectedTemplate && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Report Preview</CardTitle>
                      <CardDescription>Preview of selected template structure</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-semibold text-sm mb-2">
                            {reportTemplates.find((t) => t.id === selectedTemplate)?.name}
                          </h4>
                          <div className="space-y-2">
                            {reportTemplates
                              .find((t) => t.id === selectedTemplate)
                              ?.sections.map((section, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                  <span className="text-xs">{section}</span>
                                </div>
                              ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Estimated Size:</span>
                            <span>{reportTemplates.find((t) => t.id === selectedTemplate)?.estimatedPages} pages</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Format:</span>
                            <span className="uppercase">{reportConfig.format}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Metals:</span>
                            <span>{reportConfig.metals.length} selected</span>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Button
                            className="w-full bg-transparent"
                            variant="outline"
                            disabled={!reportConfig.title || !reportConfig.dateRange.start}
                          >
                            <EyeIcon className="w-4 h-4 mr-2" />
                            Preview Report
                          </Button>

                          <Button
                            className="w-full"
                            onClick={handleGenerateReport}
                            disabled={!reportConfig.title || !reportConfig.dateRange.start || isGenerating}
                          >
                            <DownloadIcon className="w-4 h-4 mr-2" />
                            {isGenerating ? "Generating..." : "Generate Report"}
                          </Button>
                        </div>

                        {isGenerating && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress:</span>
                              <span>{generationProgress}%</span>
                            </div>
                            <Progress value={generationProgress} />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <CopyIcon className="w-4 h-4 mr-2" />
                      Duplicate Last Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <SettingsIcon className="w-4 h-4 mr-2" />
                      Custom Template
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Schedule Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Scheduled Reports Tab */}
          <TabsContent value="scheduled" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Scheduled Reports</h2>
                <p className="text-sm text-muted-foreground">Manage automated report generation</p>
              </div>
              <Button>
                <PlusIcon className="w-4 h-4 mr-2" />
                New Schedule
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scheduledReports.map((report) => (
                <Card key={report.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{report.name}</CardTitle>
                      <Badge variant={report.status === "Active" ? "default" : "secondary"}>{report.status}</Badge>
                    </div>
                    <CardDescription>{report.template}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Frequency:</span>
                        <span>{report.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next Run:</span>
                        <span>{report.nextRun}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        Run Now
                      </Button>
                      <Button size="sm" variant="outline">
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Report History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Report History</h2>
              <p className="text-sm text-muted-foreground">Previously generated reports</p>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {[
                    { name: "Executive Summary - January 2024", date: "2024-01-31", size: "2.3 MB", format: "PDF" },
                    { name: "Technical Report - Q4 2023", date: "2024-01-15", size: "8.7 MB", format: "PDF" },
                    {
                      name: "Location Comparison - Mumbai vs Delhi",
                      date: "2024-01-10",
                      size: "4.1 MB",
                      format: "Excel",
                    },
                    { name: "Trend Analysis - 2023 Annual", date: "2024-01-05", size: "6.2 MB", format: "Word" },
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border-b last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg">
                          <FileTextIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{report.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {report.date} • {report.size} • {report.format}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <DownloadIcon className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
