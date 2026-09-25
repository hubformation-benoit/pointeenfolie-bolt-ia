import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { DbMenuItem, DbWeeklyEvent, DbOpenHours, DbSiteSettings, DbGalleryImage } from '../lib/types'
import type { MenuItem, Promotion, WeeklyEvent, OpenHours } from '../types'
import { itemNameBoth } from '../types'
import {
  pizzas as fallbackPizzas,
  salads as fallbackSalads,
  drinks as fallbackDrinks,
  desserts as fallbackDesserts,
  weeklyEvent as fallbackEvent,
  openHours as fallbackHours,
  siteInfo as fallbackSiteInfo,
  siteAlert as fallbackAlert,
  orderAlert as fallbackOrderAlert,
  galleryImages as fallbackGallery,
  promotions as fallbackPromotions,
  promoCodes as fallbackPromoCodes,
} from '../data'

export interface SiteData {
  pizzas: MenuItem[]
  salads: MenuItem[]
  drinks: MenuItem[]
  desserts: MenuItem[]
  weeklyEvent: WeeklyEvent
  openHours: OpenHours[]
  siteInfo: { address: { fr: string; en: string }; phone: string; email: string }
  siteAlert: { fr: string; en: string }
  orderAlert: { fr: string; en: string }
  galleryImages: { url: string; alt: { fr: string; en: string } }[]
  promotions: Promotion[]
  promoCodes: Record<string, number>
  carouselPizzas: { id: string; name: { fr: string; en: string }; image: string; description: { fr: string; en: string } }[]
  loading: boolean
}

const DataContext = createContext<SiteData | null>(null)

function dbToMenuItem(db: DbMenuItem): MenuItem {
  return {
    id: db.id,
    name: { fr: db.name_fr, en: db.name_en },
    description: { fr: db.desc_fr, en: db.desc_en },
    prices: db.price_p != null ? { P: db.price_p, M: db.price_m!, G: db.price_g! } : undefined,
    saladPrices: db.salad_price_entree != null ? { entree: db.salad_price_entree, repas: db.salad_price_repas! } : undefined,
    price: db.price ?? undefined,
    image: db.image ?? undefined,
    badges: db.badges || [],
  }
}

function buildCarousel(pizzas: MenuItem[]) {
  return pizzas.slice(0, 6).map(p => ({
    id: p.id,
    name: itemNameBoth(p),
    image: p.image!,
    description: p.description,
  }))
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [pizzas, setPizzas] = useState<MenuItem[]>(fallbackPizzas)
  const [salads, setSalads] = useState<MenuItem[]>(fallbackSalads)
  const [drinks, setDrinks] = useState<MenuItem[]>(fallbackDrinks)
  const [desserts, setDesserts] = useState<MenuItem[]>(fallbackDesserts)
  const [weeklyEvent, setWeeklyEvent] = useState<WeeklyEvent>(fallbackEvent)
  const [openHours, setOpenHours] = useState<OpenHours[]>(fallbackHours)
  const [siteInfo, setSiteInfo] = useState(fallbackSiteInfo)
  const [siteAlert, setSiteAlert] = useState(fallbackAlert)
  const [orderAlert, setOrderAlert] = useState(fallbackOrderAlert)
  const [galleryImages, setGalleryImages] = useState(fallbackGallery)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [menuRes, eventRes, hoursRes, settingsRes, galleryRes] = await Promise.all([
        supabase.from('menu_items').select('*').order('priority', { ascending: true }),
        supabase.from('weekly_event').select('*').eq('id', 1).maybeSingle(),
        supabase.from('open_hours').select('*').order('priority', { ascending: true }),
        supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
        supabase.from('gallery_images').select('*').order('priority', { ascending: true }),
      ])

      if (menuRes.data && menuRes.data.length > 0) {
        const allItems = menuRes.data as DbMenuItem[]
        const pizzas = allItems.filter(d => d.category === 'pizza').map(dbToMenuItem)
        const salads = allItems.filter(d => d.category === 'salad').map(dbToMenuItem)
        const drinks = allItems.filter(d => d.category === 'drink').map(dbToMenuItem)
        const desserts = allItems.filter(d => d.category === 'dessert').map(dbToMenuItem)
        setPizzas(pizzas)
        setSalads(salads)
        setDrinks(drinks)
        setDesserts(desserts)
      }

      if (eventRes.data) {
        const e = eventRes.data as DbWeeklyEvent
        setWeeklyEvent({
          bandName: e.band_name,
          description: { fr: e.desc_fr, en: e.desc_en },
          date: e.date || '',
          time: e.time,
          image: e.image || '',
        })
      }

      if (hoursRes.data && hoursRes.data.length > 0) {
        setOpenHours((hoursRes.data as DbOpenHours[]).map(h => ({
          days: { fr: h.days_fr, en: h.days_en },
          hours: { fr: h.hours_fr, en: h.hours_en },
        })))
      }

      if (settingsRes.data) {
        const s = settingsRes.data as DbSiteSettings
        setSiteInfo({
          address: { fr: s.address_fr, en: s.address_en },
          phone: s.phone,
          email: s.email,
        })
        setSiteAlert({ fr: s.alert_fr, en: s.alert_en })
        setOrderAlert({ fr: s.order_alert_fr || fallbackOrderAlert.fr, en: s.order_alert_en || fallbackOrderAlert.en })
      }

      if (galleryRes.data && galleryRes.data.length > 0) {
        setGalleryImages((galleryRes.data as DbGalleryImage[]).map(g => ({
          url: g.url,
          alt: { fr: g.alt_fr, en: g.alt_en },
        })))
      }
    } catch {
      // keep fallback data
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const carouselPizzas = buildCarousel(pizzas)

  return (
    <DataContext.Provider value={{
      pizzas, salads, drinks, desserts,
      weeklyEvent, openHours, siteInfo, siteAlert, orderAlert, galleryImages,
      promotions: fallbackPromotions,
      promoCodes: fallbackPromoCodes,
      carouselPizzas,
      loading,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
