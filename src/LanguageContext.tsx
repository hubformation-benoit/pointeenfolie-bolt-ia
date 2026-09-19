import { createContext, useContext, useCallback, useEffect, type ReactNode } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Lang } from './types'
import { setStoredLang } from './i18n'
import { t as translate } from './translations'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
  path: (to: string) => string
}

const LanguageContext = createContext<LangCtx | null>(null)

function pathFor(lang: Lang, to: string): string {
  const clean = to.replace(/^\//, '')
  return `/${lang}/${clean}`
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const params = useParams<{ lang?: string }>()
  const lang: Lang = params.lang === 'en' ? 'en' : 'fr'
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.lang = lang
    setStoredLang(lang)
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    const current = window.location.pathname
    const rest = current.replace(/^\/(fr|en)/, '') || '/'
    navigate(pathFor(l, rest))
  }, [navigate])

  const t = useCallback((key: string) => translate(key, lang), [lang])

  const path = useCallback((to: string) => pathFor(lang, to), [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, path }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
