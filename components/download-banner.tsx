"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { X } from "lucide-react"

interface DownloadBannerProps {
  show: boolean
  onClose: () => void
}

export default function DownloadBanner({ show, onClose }: DownloadBannerProps) {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
    }
  }, [show])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-gradient-to-r from-white to-purple-50 dark:from-slate-800 dark:to-purple-900/20 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50 animate-fade-in">
      <button
        onClick={() => {
          setIsVisible(false)
          onClose()
        }}
        className="absolute top-2 right-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="p-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-4 md:mb-0 md:mr-6 flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              {t("downloadSuccess")}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {t("creatorInfo")} - {t("newsletterStats")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://aimafia.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-md transition-colors text-center shadow-sm"
              >
                {t("visitNewsletter")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
