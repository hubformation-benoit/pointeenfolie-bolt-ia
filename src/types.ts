export type Lang = 'fr' | 'en'

export type PizzaSize = 'P' | 'M' | 'G'

export interface MenuItem {
  id: string
  name: { fr: string; en: string }
  description: { fr: string; en: string }
  prices?: { P: number; M: number; G: number }
  saladPrices?: { entree: number; repas: number }
  price?: number
  image?: string
  badges: string[]
}

export function itemName(item: MenuItem, lang: Lang): string {
  const fr = item.name.fr || item.id
  const en = item.name.en || fr
  return lang === 'en' ? en : fr
}

export function itemNameBoth(item: MenuItem): { fr: string; en: string } {
  const fr = item.name.fr || item.id
  const en = item.name.en || fr
  return { fr, en }
}

export interface Promotion {
  id: string
  title: { fr: string; en: string }
  description: { fr: string; en: string }
}

export interface WeeklyEvent {
  bandName: string
  description: { fr: string; en: string }
  date: string
  time: string
  image: string
}

export interface OpenHours {
  days: { fr: string; en: string }
  hours: { fr: string; en: string }
}

export interface CartItem {
  id: string
  name: { fr: string; en: string }
  size?: string
  price: number
  qty: number
}
