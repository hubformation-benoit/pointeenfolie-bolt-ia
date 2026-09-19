export interface DbMenuItem {
  id: string
  category: 'pizza' | 'salad' | 'drink' | 'dessert'
  name_fr: string
  name_en: string
  desc_fr: string
  desc_en: string
  price_p: number | null
  price_m: number | null
  price_g: number | null
  salad_price_entree: number | null
  salad_price_repas: number | null
  price: number | null
  image: string | null
  badges: string[]
  priority: number
  created_at: string
}

export interface DbWeeklyEvent {
  id: number
  band_name: string
  desc_fr: string
  desc_en: string
  date: string | null
  time: string
  image: string | null
}

export interface DbOpenHours {
  id: string
  days_fr: string
  days_en: string
  hours_fr: string
  hours_en: string
  priority: number
  created_at: string
}

export interface DbSiteSettings {
  id: number
  address_fr: string
  address_en: string
  phone: string
  email: string
  alert_fr: string
  alert_en: string
}

export interface DbGalleryImage {
  id: string
  url: string
  alt_fr: string
  alt_en: string
  priority: number
  created_at: string
}
