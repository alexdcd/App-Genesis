"use client"

import { useLanguage } from "@/contexts/language-context"

export default function HowItWorks() {
  const { t } = useLanguage()

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center mb-6">
        <span className="text-3xl mr-3">🧠</span>
        <h2 className="text-2xl font-bold">{t("howItWorks")}</h2>
      </div>

      <div className="space-y-8">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md">
            1
          </div>
          <div>
            <h3 className="font-semibold text-lg">{t("step1Title")}</h3>
            <p className="text-slate-600 dark:text-slate-400">{t("step1Description")}</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md">
            2
          </div>
          <div>
            <h3 className="font-semibold text-lg">{t("step2Title")}</h3>
            <p className="text-slate-600 dark:text-slate-400">{t("step2Description")}</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md">
            3
          </div>
          <div>
            <h3 className="font-semibold text-lg">{t("step3Title")}</h3>
            <p className="text-slate-600 dark:text-slate-400">{t("step3Description")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
