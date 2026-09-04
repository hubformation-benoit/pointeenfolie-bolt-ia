export type Lang = 'fr' | 'en'

export type PizzaSize = 'P' | 'M' | 'G'

export interface MenuItem {
  id: string
  name: string
  description: { fr: string; en: string }
  prices?: { P: number; M: number; G: number }
  price?: number
  image?: string
  badges: string[]
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
  hours: string
}

export interface CartItem {
  id: string
  name: { fr: string; en: string }
  size?: string
  price: number
  qty: number
}
