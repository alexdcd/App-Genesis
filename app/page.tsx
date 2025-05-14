"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Copy, Sparkles, Loader2, FileText, Layout, Wand2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ThinkingProcess from "@/components/thinking-process"
import BlueprintViewer from "@/components/blueprint-viewer"
import NewsletterBanner from "@/components/newsletter-banner"
import LanguageSelector from "@/components/language-selector"
import DownloadBanner from "@/components/download-banner"
import HowItWorks from "@/components/how-it-works"
import { LanguageProvider, useLanguage } from "@/contexts/language-context"

function HomeContent() {
  const { t } = useLanguage()
  const [prompt, setPrompt] = useState("")
  const [blueprint, setBlueprint] = useState("")
  const [thinking, setThinking] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("input")
  const [platform, setPlatform] = useState("generic")
  const [productType, setProductType] = useState("mobile")
  const [error, setError] = useState("")
  const [viewMode, setViewMode] = useState<"visual" | "markdown">("visual")
  const [isProductTypeAIRecommended, setIsProductTypeAIRecommended] = useState(false)
  const [showDownloadBanner, setShowDownloadBanner] = useState(false)
  const [estimatedTime, setEstimatedTime] = useState(15) // Default 15 seconds

  // Function to recommend platform based on prompt
  const recommendPlatform = () => {
    const promptLower = prompt.toLowerCase()

    if (
      promptLower.includes("code") ||
      promptLower.includes("develop") ||
      promptLower.includes("programming") ||
      promptLower.includes("software")
    ) {
      setPlatform("cursor")
    } else if (
      promptLower.includes("design") ||
      promptLower.includes("ui") ||
      promptLower.includes("ux") ||
      promptLower.includes("interface")
    ) {
      setPlatform("windsurf")
    } else {
      setPlatform("generic")
    }
  }

  // Fix the toggleProductTypeAIRecommend function
  const toggleProductTypeAIRecommend = () => {
    if (isProductTypeAIRecommended) {
      setIsProductTypeAIRecommended(false)
    } else {
      if (prompt.trim()) {
        recommendProductType()
        setIsProductTypeAIRecommended(true)
      }
    }
  }

  // Make sure the recommendProductType function is properly implemented
  const recommendProductType = () => {
    const promptLower = prompt.toLowerCase()

    console.log("Analyzing prompt for product type recommendation:", promptLower)

    if (
      promptLower.includes("mobile") ||
      promptLower.includes("app") ||
      promptLower.includes("ios") ||
      promptLower.includes("android") ||
      promptLower.includes("phone")
    ) {
      console.log("Setting product type to mobile")
      setProductType("mobile")
    } else if (
      promptLower.includes("web") ||
      promptLower.includes("website") ||
      promptLower.includes("browser") ||
      promptLower.includes("online")
    ) {
      console.log("Setting product type to web")
      setProductType("web")
    } else if (
      promptLower.includes("desktop") ||
      promptLower.includes("windows") ||
      promptLower.includes("mac") ||
      promptLower.includes("linux")
    ) {
      console.log("Setting product type to desktop")
      setProductType("desktop")
    } else if (
      promptLower.includes("backend") ||
      promptLower.includes("server") ||
      promptLower.includes("api") ||
      promptLower.includes("database")
    ) {
      console.log("Setting product type to backend")
      setProductType("backend")
    } else {
      console.log("No specific product type detected, defaulting to mobile")
      setProductType("mobile")
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    const newEstimatedTime = Math.min(17, Math.max(12, Math.floor(prompt.length / 20)))
    setEstimatedTime(newEstimatedTime)

    setIsGenerating(true)
    setThinking([])
    setBlueprint("")
    setError("")
    setActiveTab("thinking")

    try {
      const thinkingSteps = [
        "Analyzing app requirements...",
        "Identifying core features...",
        "Determining optimal tech stack...",
        "Designing system architecture...",
        "Planning user experience flows...",
        "Outlining development roadmap...",
        "Finalizing PRD document...",
      ]

      const timePerStep = Math.floor((newEstimatedTime * 1000) / thinkingSteps.length)

      for (const step of thinkingSteps) {
        setThinking((prev) => [...prev, step])
        await new Promise((resolve) => setTimeout(resolve, timePerStep))
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, platform, productType }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate PRD")
      }

      const data = await response.json()
      setBlueprint(data.blueprint)
      setActiveTab("blueprint")
    } catch (error) {
      console.error("Error generating PRD:", error)
      setError(error instanceof Error ? error.message : "Failed to generate PRD")
      setActiveTab("input")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(blueprint)
  }

  const downloadBlueprint = () => {
    const element = document.createElement("a")
    const file = new Blob([blueprint], { type: "text/markdown" })
    element.href = URL.createObjectURL(file)
    element.download = "vibeprd-document.md"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    setShowDownloadBanner(true)
  }

  const getStackRecommendation = () => {
    switch (productType) {
      case "mobile":
        return "React Native / Expo, TypeScript, Redux Toolkit, React Native Paper"
      case "web":
        return "Next.js, TypeScript, React Query, Tailwind CSS, shadcn/ui"
      case "desktop":
        return "Electron, React, TypeScript, Redux"
      case "backend":
        return "Node.js, Express, TypeScript, PostgreSQL, Prisma"
      default:
        return "React Native / Expo for mobile, Next.js for web applications"
    }
  }

  useEffect(() => {
    setIsProductTypeAIRecommended(false)
  }, [prompt])

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Simple Hero Section */}
      <div className="bg-purple-600 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex justify-end mb-4">
            <LanguageSelector />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left max-w-2xl">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <span className="text-5xl mr-3">🧠</span>
                <h1 className="text-4xl md:text-5xl font-bold">VibePRD</h1>
              </div>
              <p className="text-xl md:text-2xl mb-6 text-purple-100 max-w-xl">{t("subtitle")}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="bg-white/10 px-4 py-2 rounded-full text-sm font-medium">AI-Powered</div>
                <div className="bg-white/10 px-4 py-2 rounded-full text-sm font-medium">Multi-Language</div>
                <div className="bg-white/10 px-4 py-2 rounded-full text-sm font-medium">Developer-Friendly</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {error && (
          <Alert variant="destructive" className="mb-6 max-w-4xl mx-auto">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="input">{t("inputTab")}</TabsTrigger>
            <TabsTrigger value="thinking">{t("thinkingTab")}</TabsTrigger>
            <TabsTrigger value="blueprint">{t("blueprintTab")}</TabsTrigger>
          </TabsList>

          <TabsContent value="input">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">{t("describeIdea")}</h2>
              <Textarea
                placeholder={t("ideaPlaceholder")}
                className="min-h-[200px] mb-4"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-md font-medium mb-2">{t("targetPlatform")}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={platform === "generic" ? "default" : "outline"}
                      onClick={() => setPlatform("generic")}
                    >
                      {t("generic")}
                    </Button>
                    <Button
                      variant={platform === "cursor" ? "default" : "outline"}
                      onClick={() => setPlatform("cursor")}
                    >
                      {t("cursor")}
                    </Button>
                    <Button
                      variant={platform === "windsurf" ? "default" : "outline"}
                      onClick={() => setPlatform("windsurf")}
                    >
                      {t("windsurf")}
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-md font-medium">{t("productType")}</h3>
                    <Button
                      variant={isProductTypeAIRecommended ? "default" : "outline"}
                      size="sm"
                      onClick={toggleProductTypeAIRecommend}
                      disabled={!prompt.trim()}
                    >
                      <Wand2 className="h-4 w-4 mr-1" />
                      {t("aiRecommend")}
                    </Button>
                  </div>

                  <Select value={productType} onValueChange={setProductType} disabled={isProductTypeAIRecommended}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mobile">{t("mobileApp")}</SelectItem>
                      <SelectItem value="web">{t("webApp")}</SelectItem>
                      <SelectItem value="desktop">{t("desktopSoftware")}</SelectItem>
                      <SelectItem value="backend">{t("backendService")}</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                    <h4 className="text-sm font-medium mb-1">{t("recommendedStack")}:</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{getStackRecommendation()}</p>
                  </div>
                </div>
              </div>

              <Button onClick={handleGenerate} className="w-full" disabled={isGenerating || !prompt.trim()}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("generatingBlueprint")}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t("generateBlueprint")}
                  </>
                )}
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="thinking">
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">{t("thinkingProcess")}</h2>
                  <ThinkingProcess steps={thinking} isComplete={!isGenerating && thinking.length > 0} />
                </div>

                <div>
                  <NewsletterBanner isGenerating={isGenerating} />
                </div>
              </div>

              {thinking.length > 0 && !isGenerating && (
                <Button onClick={() => setActiveTab("blueprint")} className="w-full mt-4">
                  {t("viewBlueprint")}
                </Button>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="blueprint">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{t("generatedBlueprint")}</h2>
                <div className="flex gap-2">
                  <div className="flex border rounded-md overflow-hidden mr-2">
                    <Button
                      variant={viewMode === "visual" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("visual")}
                    >
                      <Layout className="h-4 w-4 mr-2" />
                      {t("visual")}
                    </Button>
                    <Button
                      variant={viewMode === "markdown" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("markdown")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {t("markdown")}
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    {t("copy")}
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadBlueprint}>
                    <Download className="h-4 w-4 mr-2" />
                    {t("download")}
                  </Button>
                </div>
              </div>

              {blueprint ? (
                viewMode === "visual" ? (
                  <BlueprintViewer markdown={blueprint} />
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md border overflow-auto max-h-[600px]">
                    <pre className="whitespace-pre-wrap font-mono text-sm">{blueprint}</pre>
                  </div>
                )
              ) : (
                <div className="text-center py-12 text-slate-500">
                  {isGenerating ? (
                    <p>Generating your PRD document...</p>
                  ) : (
                    <p>Your PRD document will appear here after generation</p>
                  )}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        <div className="max-w-4xl mx-auto mt-12 mb-8">
          <HowItWorks />
        </div>
      </div>

      <DownloadBanner show={showDownloadBanner} onClose={() => setShowDownloadBanner(false)} />
    </main>
  )
}

export default function Home() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  )
}
