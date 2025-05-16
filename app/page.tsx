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

      const stackRecommendation = getStackRecommendation()
      const updatedPrompt = `
${prompt}

Stack recomendado por el usuario:
${stackRecommendation}

Prioridad: El stack tecnológico recomendado por el usuario debe ser priorizado en la generación del PRD y en las recomendaciones técnicas.
`

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: updatedPrompt, platform, productType }),
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
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex justify-end mb-4">
            <LanguageSelector />
          </div>

          <div className="flex flex-col items-center justify-center gap-8">
            <div className="text-center max-w-2xl relative">
              <div className="flex items-center justify-center mb-4">
                <span className="text-5xl mr-3">🧠</span>
                <h1 className="text-4xl md:text-5xl font-bold relative group uppercase tracking-wider">
                  <span className="relative z-10 text-white">VIBE</span>
                  <span className="relative z-10 text-white">&nbsp;PRD</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-pink-500/30 blur-lg opacity-80 group-hover:opacity-95 transition-opacity duration-300" aria-hidden="true"></div>
                </h1>
              </div>
              <ul className="text-xl md:text-2xl mb-6 text-white/90 max-w-xl space-y-2 text-left mx-auto">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>{t("feature1")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>{t("feature2")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>{t("feature3")}</span>
                </li>
              </ul>
              <div className="flex justify-center">
                <a href="https://aimafia.substack.com/" target="_blank" rel="noopener noreferrer" className="bg-white/5 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm hover:bg-white/10 transition-colors flex items-center gap-2 mt-2">
                  <span>{t("createdBy")}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 opacity-70">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom badges */}


      <div className="container mx-auto py-8 px-4">
        {error && (
          <Alert variant="destructive" className="mb-6 max-w-4xl mx-auto">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="flex mb-6 w-full max-w-full overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 text-xs md:text-sm gap-2 px-1">
            <TabsTrigger value="input" className="flex-shrink-0 px-3 py-2 rounded-lg data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:font-bold">{t("inputTab")}</TabsTrigger>
            <TabsTrigger value="thinking" className="flex-shrink-0 px-3 py-2 rounded-lg data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:font-bold">{t("thinkingTab")}</TabsTrigger>
            <TabsTrigger value="blueprint" className="flex-shrink-0 px-3 py-2 rounded-lg data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:font-bold">{t("blueprintTab")}</TabsTrigger>
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
                  <div className="grid grid-cols-3 gap-2 mb-2">
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
                  <p className="text-sm text-muted-foreground">
                    {platform === "generic" && t("platformGenericDesc")}
                    {platform === "cursor" && t("platformCursorDesc")}
                    {platform === "windsurf" && t("platformWindsurfDesc")}
                  </p>
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

        {/* Sección: ¿Qué es un PRD y por qué es importante? */}
        <section className="max-w-3xl mx-auto mb-12 bg-white dark:bg-white/5 rounded-xl p-4 sm:p-6 md:p-8 shadow-lg border border-slate-200 dark:border-white/10">
  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-slate-900 dark:text-white">{t("prdTitle")}</h2>
  <div className="text-slate-700 dark:text-white/90 text-base md:text-[15px] mb-4 text-left md:text-center leading-relaxed">
    <p className="mb-2">
      <strong>Un PRD (Product Requirements Document)</strong> es el documento fundamental que describe de manera clara y estructurada <strong>qué debe hacer tu producto</strong>, <strong>cómo debe funcionar</strong> y <strong>cuáles son sus objetivos</strong>. Es la base para que todo el equipo (diseño, desarrollo, negocio) trabaje alineado.
    </p>
    <p className="mb-4 mt-6 text-center">
      <span className="text-2xl mr-2">🔥</span><strong className="uppercase">Pero un PRD de VIBE PRD, diseñado para IAs, va un paso más allá:</strong>
    </p>
    <ul className="list-none space-y-2 mb-4 text-left">
      <li className="flex items-start gap-2">
        <span className="text-green-500 dark:text-green-400 mt-1">✓</span>
        <span><strong>Define con precisión quirúrgica</strong> el alcance, objetivos y funcionalidades que la IA debe implementar.</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-green-500 dark:text-green-400 mt-1">✓</span>
        <span><strong>Evita ambigüedades</strong> que confunden a la IA, reduciendo errores y ciclos de re-generación de código.</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-green-500 dark:text-green-400 mt-1">✓</span>
        <span><strong>Permite que la IA estime dependencias</strong> y genere arquitecturas de software coherentes.</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-green-500 dark:text-green-400 mt-1">✓</span>
        <span>Es el <strong>input crucial</strong> para que las IAs de desarrollo generen código preciso y funcional, minimizando errores de interpretación.</span>
      </li>
    </ul>
    <p className="mb-2">
      Para el <strong>Vibe Coding</strong> (programar con IA de forma ágil y efectiva), un PRD de VIBE PRD es tu mejor aliado. Asegura que la IA reciba <strong>instrucciones inequívocas</strong> para generar código de alta calidad, bien estructurado y perfectamente alineado con tu visión.
    </p>
    
    <p className="mt-6 text-center">
      <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
        ¡NO LE PIDAS A UNA IA QUE PROGRAME SIN EL PRD DE VIBE PRD!
      </span>
    </p>
  </div>

  <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mt-6">
    <div className="bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm">{t("prdTag1")}</div>
    <div className="bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm">{t("prdTag2")}</div>
    <div className="bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm">{t("prdTag3")}</div>
    <div className="bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm">{t("prdTag4")}</div>
  </div>
</section>
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
