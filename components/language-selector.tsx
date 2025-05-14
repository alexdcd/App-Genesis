"use client"

import { useLanguage } from "@/contexts/language-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "pt", name: "Português" },
  ]

  return (
    <div className="flex items-center">
      <span className="mr-2 text-sm text-slate-900 dark:text-slate-100">{t("languageSelector")}:</span>
      <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
        <SelectTrigger className="w-[120px] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent className="dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700">
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600">
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
