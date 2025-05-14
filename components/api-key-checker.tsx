"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"

export default function ApiKeyChecker() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [keyInfo, setKeyInfo] = useState<{
    exists: boolean
    length: number
    preview: string | null
  } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const checkApiKey = async () => {
    setStatus("loading")
    setErrorMessage(null)

    try {
      const response = await fetch("/api/check-env")

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      if (data.status === "success") {
        setKeyInfo(data.keyStatus)
        setStatus("success")
      } else {
        throw new Error(data.message || "Unknown error")
      }
    } catch (error) {
      console.error("Error checking API key:", error)
      setErrorMessage(error instanceof Error ? error.message : "Failed to check API key")
      setStatus("error")
    }
  }

  // Check on component mount
  useEffect(() => {
    checkApiKey()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Groq API Key Status</CardTitle>
        <CardDescription>Verify that your Groq API key is properly configured</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "loading" && (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2">Checking API key...</span>
          </div>
        )}

        {status === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage || "Failed to check API key status"}</AlertDescription>
          </Alert>
        )}

        {status === "success" && keyInfo && (
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-medium mr-2">API Key Status:</span>
              {keyInfo.exists ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-1" />
                  <span>Available</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <XCircle className="h-5 w-5 mr-1" />
                  <span>Not Found</span>
                </div>
              )}
            </div>

            {keyInfo.exists && (
              <>
                <div>
                  <span className="font-medium">Key Length:</span> {keyInfo.length} characters
                </div>
                <div>
                  <span className="font-medium">Key Preview:</span> {keyInfo.preview}
                </div>
                <Alert
                  className={keyInfo.length < 20 ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"}
                >
                  <AlertCircle className={`h-4 w-4 ${keyInfo.length < 20 ? "text-yellow-600" : "text-green-600"}`} />
                  <AlertDescription>
                    {keyInfo.length < 20
                      ? "The API key seems shorter than expected. Typical API keys are longer."
                      : "The API key length looks appropriate."}
                  </AlertDescription>
                </Alert>
              </>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkApiKey} disabled={status === "loading"}>
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Check Again"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
