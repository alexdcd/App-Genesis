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
      <span className="mr-2 text-sm text-slate-600 dark:text-slate-400">{t("languageSelector")}:</span>
      <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
