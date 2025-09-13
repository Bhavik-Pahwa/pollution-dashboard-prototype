"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CalculatorIcon,
  InfoIcon,
  DownloadIcon,
  HistoryIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  FlaskConicalIcon,
} from "lucide-react"

interface MetalData {
  name: string
  symbol: string
  concentration: number
  standardValue: number
  weight: number
}

interface IndexResult {
  value: number
  level: string
  color: string
  description: string
}

interface CalculationResults {
  hpi: IndexResult
  hei: IndexResult
  cd: IndexResult
  mcd: IndexResult
}

export default function CalculatorPage() {
  const [selectedIndex, setSelectedIndex] = useState("hpi")
  const [metals, setMetals] = useState<MetalData[]>([
    { name: "Lead", symbol: "Pb", concentration: 0, standardValue: 15, weight: 1 },
    { name: "Cadmium", symbol: "Cd", concentration: 0, standardValue: 5, weight: 1 },
    { name: "Chromium", symbol: "Cr", concentration: 0, standardValue: 25, weight: 1 },
    { name: "Mercury", symbol: "Hg", concentration: 0, standardValue: 2, weight: 1 },
    { name: "Arsenic", symbol: "As", concentration: 0, standardValue: 10, weight: 1 },
  ])
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [showFormulas, setShowFormulas] = useState(false)

  const calculateHPI = (metalData: MetalData[]): number => {
    const numerator = metalData.reduce((sum, metal) => {
      const wi = metal.weight
      const qi = (metal.concentration / metal.standardValue) * 100
      return sum + wi * qi
    }, 0)

    const denominator = metalData.reduce((sum, metal) => sum + metal.weight, 0)

    return numerator / denominator
  }

  const calculateHEI = (metalData: MetalData[]): number => {
    return metalData.reduce((sum, metal) => {
      return sum + metal.concentration / metal.standardValue
    }, 0)
  }

  const calculateCD = (metalData: MetalData[]): number => {
    return metalData.reduce((sum, metal) => {
      return sum + metal.concentration / metal.standardValue
    }, 0)
  }

  const calculateMCD = (metalData: MetalData[]): number => {
    const cd = calculateCD(metalData)
    return cd / metalData.length
  }

  const getIndexLevel = (value: number, indexType: string): IndexResult => {
    let level: string, color: string, description: string

    switch (indexType) {
      case "hpi":
        if (value < 25) {
          level = "Excellent"
          color = "text-green-600"
          description = "Water quality is excellent for consumption"
        } else if (value < 50) {
          level = "Good"
          color = "text-blue-600"
          description = "Water quality is good with minor concerns"
        } else if (value < 75) {
          level = "Poor"
          color = "text-orange-600"
          description = "Water quality is poor, treatment recommended"
        } else if (value < 100) {
          level = "Very Poor"
          color = "text-red-600"
          description = "Water quality is very poor, immediate action required"
        } else {
          level = "Critical"
          color = "text-red-800"
          description = "Critical contamination level, unsafe for any use"
        }
        break
      case "hei":
        if (value < 10) {
          level = "Low"
          color = "text-green-600"
          description = "Low ecological impact"
        } else if (value < 20) {
          level = "Moderate"
          color = "text-orange-600"
          description = "Moderate ecological impact"
        } else {
          level = "High"
          color = "text-red-600"
          description = "High ecological impact"
        }
        break
      default:
        if (value < 1) {
          level = "Low"
          color = "text-green-600"
          description = "Low contamination level"
        } else if (value < 3) {
          level = "Moderate"
          color = "text-orange-600"
          description = "Moderate contamination level"
        } else {
          level = "High"
          color = "text-red-600"
          description = "High contamination level"
        }
    }

    return { value, level, color, description }
  }

  const calculateAllIndices = () => {
    const hpiValue = calculateHPI(metals)
    const heiValue = calculateHEI(metals)
    const cdValue = calculateCD(metals)
    const mcdValue = calculateMCD(metals)

    setResults({
      hpi: getIndexLevel(hpiValue, "hpi"),
      hei: getIndexLevel(heiValue, "hei"),
      cd: getIndexLevel(cdValue, "cd"),
      mcd: getIndexLevel(mcdValue, "mcd"),
    })
  }

  const updateMetalConcentration = (index: number, value: number) => {
    const updatedMetals = [...metals]
    updatedMetals[index].concentration = value
    setMetals(updatedMetals)
  }

  const updateMetalWeight = (index: number, value: number) => {
    const updatedMetals = [...metals]
    updatedMetals[index].weight = value
    setMetals(updatedMetals)
  }

  useEffect(() => {
    calculateAllIndices()
  }, [metals])

  const indexFormulas = {
    hpi: {
      name: "Heavy Metal Pollution Index (HPI)",
      formula: "HPI = Σ(Wi × Qi) / ΣWi",
      explanation:
        "Where Wi is the unit weight of metal i, and Qi is the sub-index of metal i calculated as (Ci/Si) × 100",
    },
    hei: {
      name: "Heavy Metal Evaluation Index (HEI)",
      formula: "HEI = Σ(Ci/Si)",
      explanation: "Where Ci is the concentration of metal i and Si is the standard value for metal i",
    },
    cd: {
      name: "Contamination Degree (Cd)",
      formula: "Cd = Σ(Ci/Si)",
      explanation: "Sum of contamination factors for all metals",
    },
    mcd: {
      name: "Modified Contamination Degree (mCd)",
      formula: "mCd = Cd / n",
      explanation: "Where Cd is the contamination degree and n is the number of metals analyzed",
    },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <CalculatorIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Pollution Index Calculator</h1>
              <p className="text-sm text-muted-foreground">Calculate heavy metal pollution indices</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Index Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FlaskConicalIcon className="w-5 h-5" />
                  <span>Index Configuration</span>
                </CardTitle>
                <CardDescription>Select pollution index type and configure parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Index Type</Label>
                    <Select value={selectedIndex} onValueChange={setSelectedIndex}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hpi">Heavy Metal Pollution Index (HPI)</SelectItem>
                        <SelectItem value="hei">Heavy Metal Evaluation Index (HEI)</SelectItem>
                        <SelectItem value="cd">Contamination Degree (Cd)</SelectItem>
                        <SelectItem value="mcd">Modified Contamination Degree (mCd)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" onClick={() => setShowFormulas(!showFormulas)} className="w-full">
                      <InfoIcon className="w-4 h-4 mr-2" />
                      {showFormulas ? "Hide" : "Show"} Formulas
                    </Button>
                  </div>
                </div>

                {showFormulas && (
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-semibold">
                          {indexFormulas[selectedIndex as keyof typeof indexFormulas].name}
                        </p>
                        <p className="font-mono text-sm bg-muted p-2 rounded">
                          {indexFormulas[selectedIndex as keyof typeof indexFormulas].formula}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {indexFormulas[selectedIndex as keyof typeof indexFormulas].explanation}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Metal Concentrations */}
            <Card>
              <CardHeader>
                <CardTitle>Heavy Metal Concentrations</CardTitle>
                <CardDescription>Enter concentration values and configure weights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metals.map((metal, index) => (
                    <div key={metal.symbol} className="grid grid-cols-5 gap-4 items-center p-4 border rounded-lg">
                      <div>
                        <Label className="text-sm font-medium">
                          {metal.name} ({metal.symbol})
                        </Label>
                        <p className="text-xs text-muted-foreground">Standard: {metal.standardValue} µg/L</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Concentration (µg/L)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={metal.concentration || ""}
                          onChange={(e) => updateMetalConcentration(index, Number.parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Weight</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={metal.weight}
                          onChange={(e) => updateMetalWeight(index, Number.parseFloat(e.target.value) || 1)}
                          placeholder="1.0"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Sub-index</Label>
                        <div className="text-sm font-mono p-2 bg-muted rounded">
                          {((metal.concentration / metal.standardValue) * 100).toFixed(2)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Status</Label>
                        <div className="flex items-center">
                          {metal.concentration <= metal.standardValue ? (
                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertTriangleIcon className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                  <Button variant="outline">
                    <HistoryIcon className="w-4 h-4 mr-2" />
                    Load Previous Data
                  </Button>
                  <Button onClick={calculateAllIndices}>
                    <CalculatorIcon className="w-4 h-4 mr-2" />
                    Recalculate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Primary Result */}
            {results && (
              <Card>
                <CardHeader>
                  <CardTitle>Calculation Results</CardTitle>
                  <CardDescription>Pollution index values and interpretations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Primary Index Result */}
                  <div className="text-center p-6 border-2 border-dashed rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">
                      {indexFormulas[selectedIndex as keyof typeof indexFormulas].name}
                    </div>
                    <div className="text-4xl font-bold mb-2">
                      {results[selectedIndex as keyof CalculationResults].value.toFixed(2)}
                    </div>
                    <Badge
                      variant="secondary"
                      className={`${results[selectedIndex as keyof CalculationResults].color} bg-opacity-10`}
                    >
                      {results[selectedIndex as keyof CalculationResults].level}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      {results[selectedIndex as keyof CalculationResults].description}
                    </p>
                  </div>

                  {/* All Results Summary */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">All Indices</h4>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">HPI</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm">{results.hpi.value.toFixed(2)}</span>
                          <Badge variant="outline" className={`text-xs ${results.hpi.color}`}>
                            {results.hpi.level}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm">HEI</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm">{results.hei.value.toFixed(2)}</span>
                          <Badge variant="outline" className={`text-xs ${results.hei.color}`}>
                            {results.hei.level}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cd</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm">{results.cd.value.toFixed(2)}</span>
                          <Badge variant="outline" className={`text-xs ${results.cd.color}`}>
                            {results.cd.level}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm">mCd</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm">{results.mcd.value.toFixed(2)}</span>
                          <Badge variant="outline" className={`text-xs ${results.mcd.color}`}>
                            {results.mcd.level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Risk Assessment</h4>
                    <div className="space-y-2">
                      {metals.filter((m) => m.concentration > m.standardValue).length > 0 ? (
                        <div className="flex items-start space-x-2">
                          <AlertTriangleIcon className="w-4 h-4 text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-600">Elevated Levels Detected</p>
                            <p className="text-xs text-muted-foreground">
                              {metals
                                .filter((m) => m.concentration > m.standardValue)
                                .map((m) => m.name)
                                .join(", ")}{" "}
                              exceed standard values
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start space-x-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-green-600">Within Standards</p>
                            <p className="text-xs text-muted-foreground">
                              All metal concentrations are within acceptable limits
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button className="w-full bg-transparent" variant="outline">
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                    <Button className="w-full bg-transparent" variant="outline">
                      <TrendingUpIcon className="w-4 h-4 mr-2" />
                      Compare Historical
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Reference */}
            <Card>
              <CardHeader>
                <CardTitle>Reference Standards</CardTitle>
                <CardDescription>WHO/EPA guidelines for heavy metals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {metals.map((metal) => (
                    <div key={metal.symbol} className="flex justify-between">
                      <span>
                        {metal.name} ({metal.symbol})
                      </span>
                      <span className="font-mono">{metal.standardValue} µg/L</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
