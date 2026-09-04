import type { Lang } from './types'

export function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'en'
  const langs = navigator.languages ?? [navigator.language]
  for (const l of langs) {
    if (l.toLowerCase().startsWith('fr')) return 'fr'
    if (l.toLowerCase().startsWith('en')) return 'en'
  }
  return 'en'
}

export function getStoredLang(): Lang {
  try {
    const stored = localStorage.getItem('lang')
    if (stored === 'fr' || stored === 'en') return stored
  } catch { /* ignore */ }
  return detectLang()
}

export function setStoredLang(lang: Lang) {
  try { localStorage.setItem('lang', lang) } catch { /* ignore */ }
}
