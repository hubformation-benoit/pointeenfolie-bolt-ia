import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Lang } from './types'
import { getStoredLang, setStoredLang } from './i18n'
import { t as translate } from './translations'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LangCtx | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getStoredLang)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    setStoredLang(l)
    document.documentElement.lang = l
  }, [])

  const t = useCallback((key: string) => translate(key, lang), [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
