import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../lib/supabase'
import type { DbMenuItem, DbWeeklyEvent, DbOpenHours, DbSiteSettings, DbGalleryImage } from '../../lib/types'
import ImageInput from './ImageInput'
import OrdersSection from './OrdersSection'

type Section = 'pizzas' | 'salads' | 'drinks' | 'desserts' | 'event' | 'hours' | 'settings' | 'alert' | 'orderAlert' | 'gallery'

interface MenuItemForm {
  id?: string
  name_fr: string
  name_en: string
  desc_fr: string
  desc_en: string
  price_p: string
  price_m: string
  price_g: string
  salad_price_entree: string
  salad_price_repas: string
  price: string
  image: string
  badges: string[]
  priority: string
}

const BADGE_OPTIONS = [
  { value: 'spicy', label: 'Épicé' },
  { value: 'veg', label: 'Végétarien' },
  { value: 'dessert', label: 'Dessert' },
]

export default function AdminDashboard() {
  const { session, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [section, setSection] = useState<Section>('pizzas')

  const isOrdersTab = location.pathname === '/admin/orders'

  useEffect(() => {
    if (!authLoading && !session) navigate('/admin/login')
  }, [authLoading, session, navigate])

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-cream-50"><p className="text-olive-600">Chargement...</p></div>
  }
  if (!session) return null

  const sections: { id: Section; label: string }[] = [
    { id: 'pizzas', label: 'Pizzas' },
    { id: 'salads', label: 'Salades' },
    { id: 'drinks', label: 'Boissons' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'event', label: 'Événement' },
    { id: 'hours', label: 'Horaires' },
    { id: 'settings', label: 'Infos du site' },
    { id: 'alert', label: 'Alerte du site' },
    { id: 'orderAlert', label: 'Alerte commande' },
    { id: 'gallery', label: 'Galerie' },
  ]

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="bg-olive-900 text-cream-100 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/images/iu/petit-logo.svg" alt="" className="h-10 w-auto" />
              <h1 className="font-display text-lg uppercase tracking-wide text-cream-100">Administration</h1>
            </div>
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-1.5 text-cream-200 hover:text-brand-gold text-sm transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Voir le site
              </a>
              <button onClick={() => signOut()} className="flex items-center gap-1.5 text-cream-200 hover:text-brick-300 text-sm transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Déconnexion
              </button>
            </div>
          </div>
          {/* Main tabs: Contenu / Commandes */}
          <div className="flex gap-2 pb-3">
            <button
              onClick={() => navigate('/admin/content')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                !isOrdersTab ? 'bg-brand-green text-white shadow-md' : 'bg-olive-800 text-cream-200 hover:bg-olive-700'
              }`}
            >
              Contenu
            </button>
            <button
              onClick={() => navigate('/admin/orders')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                isOrdersTab ? 'bg-brand-green text-white shadow-md' : 'bg-olive-800 text-cream-200 hover:bg-olive-700'
              }`}
            >
              Commandes
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isOrdersTab ? (
          <OrdersSection />
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    section === s.id
                      ? 'bg-brand-green text-white shadow-md'
                      : 'bg-olive-100 text-olive-700 hover:bg-olive-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {section === 'pizzas' && <MenuItemsEditor category="pizza" />}
            {section === 'salads' && <MenuItemsEditor category="salad" />}
            {section === 'drinks' && <MenuItemsEditor category="drink" />}
            {section === 'desserts' && <MenuItemsEditor category="dessert" />}
            {section === 'event' && <EventEditor />}
            {section === 'hours' && <HoursEditor />}
            {section === 'settings' && <SettingsEditor />}
            {section === 'alert' && <AlertEditor />}
            {section === 'orderAlert' && <OrderAlertEditor />}
            {section === 'gallery' && <GalleryEditor />}
          </>
        )}
      </div>
    </div>
  )
}

function emptyMenuItemForm(): MenuItemForm {
  return {
    name_fr: '', name_en: '', desc_fr: '', desc_en: '',
    price_p: '', price_m: '', price_g: '',
    salad_price_entree: '', salad_price_repas: '',
    price: '', image: '', badges: [], priority: '0',
  }
}

function dbToForm(db: DbMenuItem): MenuItemForm {
  return {
    id: db.id,
    name_fr: db.name_fr, name_en: db.name_en,
    desc_fr: db.desc_fr, desc_en: db.desc_en,
    price_p: db.price_p?.toString() ?? '',
    price_m: db.price_m?.toString() ?? '',
    price_g: db.price_g?.toString() ?? '',
    salad_price_entree: db.salad_price_entree?.toString() ?? '',
    salad_price_repas: db.salad_price_repas?.toString() ?? '',
    price: db.price?.toString() ?? '',
    image: db.image ?? '',
    badges: db.badges || [],
    priority: db.priority.toString(),
  }
}

function formToDb(form: MenuItemForm, category: string) {
  return {
    category,
    name_fr: form.name_fr,
    name_en: form.name_en,
    desc_fr: form.desc_fr,
    desc_en: form.desc_en,
    price_p: form.price_p ? parseFloat(form.price_p) : null,
    price_m: form.price_m ? parseFloat(form.price_m) : null,
    price_g: form.price_g ? parseFloat(form.price_g) : null,
    salad_price_entree: form.salad_price_entree ? parseFloat(form.salad_price_entree) : null,
    salad_price_repas: form.salad_price_repas ? parseFloat(form.salad_price_repas) : null,
    price: form.price ? parseFloat(form.price) : null,
    image: form.image || null,
    badges: form.badges,
    priority: parseInt(form.priority) || 0,
  }
}

function MenuItemsEditor({ category }: { category: string }) {
  const [items, setItems] = useState<DbMenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<MenuItemForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [initialized, setInitialized] = useState(false)

  const load = useCallback(async () => {
    if (initialized) setLoading(false)
    const { data } = await supabase.from('menu_items').select('*').eq('category', category).order('priority', { ascending: true })
    setItems((data as DbMenuItem[]) || [])
    if (!initialized) {
      setLoading(false)
      setInitialized(true)
    }
  }, [category, initialized])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    if (!editing) return
    if (!editing.name_fr.trim()) {
      setError('Le nom français est obligatoire')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = formToDb(editing, category)
      if (editing.id) {
        await supabase.from('menu_items').update(payload).eq('id', editing.id)
      } else {
        await supabase.from('menu_items').insert(payload)
      }
      setEditing(null)
      await load()
    } catch {
      setError('Échec de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet élément?')) return
    await supabase.from('menu_items').delete().eq('id', id)
    await load()
  }

  const movePriority = async (item: DbMenuItem, dir: -1 | 1) => {
    const sorted = [...items]
    const idx = sorted.findIndex(i => i.id === item.id)
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= sorted.length) return
    const reordered = [...sorted]
    const [moved] = reordered.splice(idx, 1)
    reordered.splice(swapIdx, 0, moved)
    await Promise.all(
      reordered.map((it, i) =>
        supabase.from('menu_items').update({ priority: i }).eq('id', it.id)
      )
    )
    await load()
  }

  const categoryLabel = category === 'pizza' ? 'pizza' : category === 'salad' ? 'salade' : category === 'drink' ? 'boisson' : 'dessert'

  const showPizzaPrices = category === 'pizza'
  const showSaladPrices = category === 'salad'
  const showSimplePrice = category === 'drink' || category === 'dessert'
  const showImage = category !== 'drink'
  const showBadges = category !== 'drink'

  if (loading) return <p className="text-olive-600">Chargement...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-brand-green uppercase tracking-wide">
          {category === 'pizza' ? 'Pizzas' : category === 'salad' ? 'Salades' : category === 'drink' ? 'Boissons' : 'Desserts'}
        </h2>
        <button onClick={() => setEditing(emptyMenuItemForm())} className="btn-primary text-sm py-2">
          + Ajouter
        </button>
      </div>

      {editing && (
        <div className="card p-6 mb-6 space-y-4">
          <h3 className="font-display text-lg text-olive-800">{editing.id ? 'Modifier' : 'Ajouter'} {categoryLabel}</h3>
          {error && <p className="text-brick-600 text-sm bg-brick-50 rounded-lg px-4 py-2">{error}</p>}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-olive-700 mb-1">Nom (français) *</label>
              <input type="text" required value={editing.name_fr} onChange={e => setEditing({ ...editing, name_fr: e.target.value })}
                className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-olive-700 mb-1">Nom (anglais)</label>
              <input type="text" value={editing.name_en} onChange={e => setEditing({ ...editing, name_en: e.target.value })}
                className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-olive-700 mb-1">Description (français)</label>
              <textarea rows={2} value={editing.desc_fr} onChange={e => setEditing({ ...editing, desc_fr: e.target.value })}
                className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-olive-700 mb-1">Description (anglais)</label>
              <textarea rows={2} value={editing.desc_en} onChange={e => setEditing({ ...editing, desc_en: e.target.value })}
                className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
          </div>

          {showPizzaPrices && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-olive-700 mb-1">Prix Petite ($)</label>
                <input type="number" step="0.01" value={editing.price_p} onChange={e => setEditing({ ...editing, price_p: e.target.value })}
                  className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-olive-700 mb-1">Prix Moyenne ($)</label>
                <input type="number" step="0.01" value={editing.price_m} onChange={e => setEditing({ ...editing, price_m: e.target.value })}
                  className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-olive-700 mb-1">Prix Grande ($)</label>
                <input type="number" step="0.01" value={editing.price_g} onChange={e => setEditing({ ...editing, price_g: e.target.value })}
                  className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
              </div>
            </div>
          )}

          {showSaladPrices && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-olive-700 mb-1">Prix Entrée ($)</label>
                <input type="number" step="0.01" value={editing.salad_price_entree} onChange={e => setEditing({ ...editing, salad_price_entree: e.target.value })}
                  className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-olive-700 mb-1">Prix Repas ($)</label>
                <input type="number" step="0.01" value={editing.salad_price_repas} onChange={e => setEditing({ ...editing, salad_price_repas: e.target.value })}
                  className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
              </div>
            </div>
          )}

          {showSimplePrice && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-olive-700 mb-1">Prix ($)</label>
                <input type="number" step="0.01" value={editing.price} onChange={e => setEditing({ ...editing, price: e.target.value })}
                  className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
              </div>
            </div>
          )}

          {showImage && <ImageInput value={editing.image} onChange={url => setEditing({ ...editing, image: url })} />}

          {showBadges && (
            <div>
              <label className="block text-sm font-semibold text-olive-700 mb-1">Badges</label>
              <div className="flex gap-3 flex-wrap">
                {BADGE_OPTIONS.map(b => (
                  <label key={b.value} className="flex items-center gap-2 text-sm text-olive-700">
                    <input
                      type="checkbox"
                      checked={editing.badges.includes(b.value)}
                      onChange={e => {
                        if (e.target.checked) setEditing({ ...editing, badges: [...editing.badges, b.value] })
                        else setEditing({ ...editing, badges: editing.badges.filter(x => x !== b.value) })
                      }}
                    />
                    {b.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-olive-700 mb-1">Priorité d'affichage</label>
            <input type="number" value={editing.priority} onChange={e => setEditing({ ...editing, priority: e.target.value })}
              className="w-32 rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
            <p className="text-xs text-olive-500 mt-1">Plus le chiffre est petit, plus l'élément apparaît tôt.</p>
          </div>

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 disabled:opacity-50">
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <button onClick={() => setEditing(null)} className="btn-outline text-sm py-2">Annuler</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.id} className="card p-4 flex items-center gap-4">
            {item.image && <img src={item.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />}
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-base text-brand-green uppercase tracking-wide truncate">{item.name_fr}</h3>
              {item.name_en && <p className="text-xs text-olive-500 truncate">{item.name_en}</p>}
              <p className="text-sm text-olive-600 truncate">{item.desc_fr}</p>
              {item.badges.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {item.badges.map(b => (
                    <span key={b} className="badge badge-veg text-xs">{b}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => movePriority(item, -1)} disabled={i === 0}
                className="w-8 h-8 rounded-lg bg-olive-100 text-olive-700 hover:bg-olive-200 disabled:opacity-30 font-bold">↑</button>
              <button onClick={() => movePriority(item, 1)} disabled={i === items.length - 1}
                className="w-8 h-8 rounded-lg bg-olive-100 text-olive-700 hover:bg-olive-200 disabled:opacity-30 font-bold">↓</button>
              <button onClick={() => setEditing(dbToForm(item))}
                className="px-3 py-2 rounded-lg bg-brand-green text-white text-sm font-semibold hover:bg-brand-green-dark transition-colors">Modifier</button>
              <button onClick={() => handleDelete(item.id)}
                className="px-3 py-2 rounded-lg bg-brick-100 text-brick-700 text-sm font-semibold hover:bg-brick-200 transition-colors">Supprimer</button>
            </div>
          </div>
        ))}
        {items.length === 0 && !editing && (
          <p className="text-olive-500 text-center py-8">Aucun élément. Cliquez sur « Ajouter ».</p>
        )}
      </div>
    </div>
  )
}

function EventEditor() {
  const [form, setForm] = useState<DbWeeklyEvent | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('weekly_event').select('*').eq('id', 1).maybeSingle().then(({ data }) => {
      if (data) setForm(data as DbWeeklyEvent)
    })
  }, [])

  const handleSave = async () => {
    if (!form) return
    setSaving(true)
    await supabase.from('weekly_event').update({
      band_name: form.band_name,
      desc_fr: form.desc_fr,
      desc_en: form.desc_en,
      date: form.date,
      time: form.time,
      image: form.image,
    }).eq('id', 1)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!form) return <p className="text-olive-600">Chargement...</p>

  return (
    <div className="card p-6 space-y-4 max-w-2xl">
      <h2 className="font-display text-xl text-brand-green uppercase tracking-wide">Événement de la semaine</h2>
      <div>
        <label className="block text-sm font-semibold text-olive-700 mb-1">Nom du groupe</label>
        <input type="text" value={form.band_name} onChange={e => setForm({ ...form, band_name: e.target.value })}
          className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-olive-700 mb-1">Description (français)</label>
          <textarea rows={3} value={form.desc_fr} onChange={e => setForm({ ...form, desc_fr: e.target.value })}
            className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-olive-700 mb-1">Description (anglais)</label>
          <textarea rows={3} value={form.desc_en} onChange={e => setForm({ ...form, desc_en: e.target.value })}
            className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-olive-700 mb-1">Date</label>
          <input type="date" value={form.date ?? ''} onChange={e => setForm({ ...form, date: e.target.value })}
            className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-olive-700 mb-1">Heure</label>
          <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
            className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
        </div>
      </div>
      <ImageInput value={form.image ?? ''} onChange={url => setForm({ ...form, image: url })} />
      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 disabled:opacity-50">
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
        {saved && <span className="text-brand-green text-sm font-semibold">Sauvegardé!</span>}
      </div>
    </div>
  )
}

function HoursEditor() {
  const [items, setItems] = useState<DbOpenHours[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('open_hours').select('*').order('priority', { ascending: true })
    setItems((data as DbOpenHours[]) || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const update = async (id: string, field: keyof DbOpenHours, value: string) => {
    await supabase.from('open_hours').update({ [field]: value }).eq('id', id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const add = async () => {
    const priority = items.length
    const { data } = await supabase.from('open_hours').insert({
      days_fr: '', days_en: '', hours_fr: '', hours_en: '', priority,
    }).select('*').single()
    if (data) setItems([...items, data as DbOpenHours])
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer cette plage horaire?')) return
    await supabase.from('open_hours').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  if (loading) return <p className="text-olive-600">Chargement...</p>

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-brand-green uppercase tracking-wide">Horaires d'ouverture</h2>
        <button onClick={add} className="btn-primary text-sm py-2">+ Ajouter</button>
      </div>
      {items.map((h) => (
        <div key={h.id} className="card p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-olive-700 mb-1">Jours (français)</label>
              <input type="text" value={h.days_fr} onChange={e => update(h.id, 'days_fr', e.target.value)}
                className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-olive-700 mb-1">Jours (anglais)</label>
              <input type="text" value={h.days_en} onChange={e => update(h.id, 'days_en', e.target.value)}
                className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-olive-700 mb-1">Heures (français)</label>
              <input type="text" value={h.hours_fr} onChange={e => update(h.id, 'hours_fr', e.target.value)}
                className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-olive-700 mb-1">Heures (anglais)</label>
              <input type="text" value={h.hours_en} onChange={e => update(h.id, 'hours_en', e.target.value)}
                className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
          </div>
          <button onClick={() => remove(h.id)} className="text-brick-600 text-sm hover:text-brick-700">Supprimer</button>
        </div>
      ))}
    </div>
  )
}

function SettingsEditor() {
  const [form, setForm] = useState<DbSiteSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).maybeSingle().then(({ data }) => {
      if (data) setForm(data as DbSiteSettings)
    })
  }, [])

  const handleSave = async () => {
    if (!form) return
    setSaving(true)
    await supabase.from('site_settings').update({
      address_fr: form.address_fr,
      address_en: form.address_en,
      phone: form.phone,
      email: form.email,
    }).eq('id', 1)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!form) return <p className="text-olive-600">Chargement...</p>

  return (
    <div className="card p-6 space-y-4 max-w-2xl">
      <h2 className="font-display text-xl text-brand-green uppercase tracking-wide">Informations du site</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-olive-700 mb-1">Adresse (français)</label>
          <textarea rows={2} value={form.address_fr} onChange={e => setForm({ ...form, address_fr: e.target.value })}
            className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-olive-700 mb-1">Adresse (anglais)</label>
          <textarea rows={2} value={form.address_en} onChange={e => setForm({ ...form, address_en: e.target.value })}
            className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-olive-700 mb-1">Téléphone</label>
          <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-olive-700 mb-1">Courriel</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 disabled:opacity-50">
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
        {saved && <span className="text-brand-green text-sm font-semibold">Sauvegardé!</span>}
      </div>
    </div>
  )
}

function AlertEditor() {
  const [form, setForm] = useState<DbSiteSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).maybeSingle().then(({ data }) => {
      if (data) setForm(data as DbSiteSettings)
    })
  }, [])

  const handleSave = async () => {
    if (!form) return
    setSaving(true)
    await supabase.from('site_settings').update({
      alert_fr: form.alert_fr,
      alert_en: form.alert_en,
    }).eq('id', 1)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!form) return <p className="text-olive-600">Chargement...</p>

  return (
    <div className="card p-6 space-y-4 max-w-2xl">
      <h2 className="font-display text-xl text-brand-green uppercase tracking-wide">Alerte du site</h2>
      <div>
        <label className="block text-sm font-semibold text-olive-700 mb-1">Texte (français)</label>
        <textarea rows={3} value={form.alert_fr} onChange={e => setForm({ ...form, alert_fr: e.target.value })}
          className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-olive-700 mb-1">Texte (anglais)</label>
        <textarea rows={3} value={form.alert_en} onChange={e => setForm({ ...form, alert_en: e.target.value })}
          className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
      </div>
      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 disabled:opacity-50">
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
        {saved && <span className="text-brand-green text-sm font-semibold">Sauvegardé!</span>}
      </div>
    </div>
  )
}

function OrderAlertEditor() {
  const [form, setForm] = useState<DbSiteSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).maybeSingle().then(({ data }) => {
      if (data) setForm(data as DbSiteSettings)
    })
  }, [])

  const handleSave = async () => {
    if (!form) return
    setSaving(true)
    await supabase.from('site_settings').update({
      order_alert_fr: form.order_alert_fr,
      order_alert_en: form.order_alert_en,
    }).eq('id', 1)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!form) return <p className="text-olive-600">Chargement...</p>

  return (
    <div className="card p-6 space-y-4 max-w-2xl">
      <h2 className="font-display text-xl text-brand-green uppercase tracking-wide">Alerte de commande</h2>
      <p className="text-sm text-olive-500">Ce message s'affiche en haut de la page de confirmation de commande, sur fond jaune. Utile pour informer les clients d'un délai, d'un achalandage élevé, etc.</p>
      <div>
        <label className="block text-sm font-semibold text-olive-700 mb-1">Texte (français)</label>
        <textarea rows={3} value={form.order_alert_fr ?? ''} onChange={e => setForm({ ...form, order_alert_fr: e.target.value })}
          className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-olive-700 mb-1">Texte (anglais)</label>
        <textarea rows={3} value={form.order_alert_en ?? ''} onChange={e => setForm({ ...form, order_alert_en: e.target.value })}
          className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
      </div>
      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 disabled:opacity-50">
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
        {saved && <span className="text-brand-green text-sm font-semibold">Sauvegardé!</span>}
      </div>
    </div>
  )
}

function GalleryEditor() {
  const [items, setItems] = useState<DbGalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('gallery_images').select('*').order('priority', { ascending: true })
    setItems((data as DbGalleryImage[]) || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const update = async (id: string, field: keyof DbGalleryImage, value: string) => {
    await supabase.from('gallery_images').update({ [field]: value }).eq('id', id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const add = async () => {
    const priority = items.length
    const { data } = await supabase.from('gallery_images').insert({
      url: '', alt_fr: '', alt_en: '', priority,
    }).select('*').single()
    if (data) setItems([...items, data as DbGalleryImage])
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer cette image?')) return
    await supabase.from('gallery_images').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  if (loading) return <p className="text-olive-600">Chargement...</p>

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-brand-green uppercase tracking-wide">Galerie</h2>
        <button onClick={add} className="btn-primary text-sm py-2">+ Ajouter</button>
      </div>
      {items.map((img) => (
        <div key={img.id} className="card p-4 space-y-3">
          <ImageInput value={img.url} onChange={url => update(img.id, 'url', url)} label="Image" />
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-olive-700 mb-1">Description (français)</label>
              <input type="text" value={img.alt_fr} onChange={e => update(img.id, 'alt_fr', e.target.value)}
                className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-olive-700 mb-1">Description (anglais)</label>
              <input type="text" value={img.alt_en} onChange={e => update(img.id, 'alt_en', e.target.value)}
                className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
          </div>
          <button onClick={() => remove(img.id)} className="text-brick-600 text-sm hover:text-brick-700">Supprimer</button>
        </div>
      ))}
    </div>
  )
}
