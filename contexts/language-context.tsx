"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, translations, getDefaultLanguage } from "@/lib/translations"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof typeof translations.en) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setLanguage(getDefaultLanguage())
    setMounted(true)
  }, [])

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key]
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {mounted ? children : null}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
