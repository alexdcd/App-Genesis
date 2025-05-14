"use client"

import { useLanguage } from "@/contexts/language-context"

interface NewsletterBannerProps {
  isGenerating: boolean
}

export default function NewsletterBanner({ isGenerating }: NewsletterBannerProps) {
  const { t } = useLanguage()

  if (!isGenerating) return null

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg shadow-md card-hover-effect">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-3 md:mb-0">
          <h3 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent animate-gradient">
            {t("newsletterTitle")}
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 max-w-md">{t("newsletterSubtitle")}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold mb-1">{t("newsletterStats")}</p>
            <p className="text-xs text-center mb-2">{t("newsletterPosition")}</p>
            <a
              href="https://aimafia.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-md transition-colors text-sm shadow-sm"
            >
              {t("newsletterButton")}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
