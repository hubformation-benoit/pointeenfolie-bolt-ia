import { useState } from 'react'
import { useLang } from '../LanguageContext'
import { pizzas, salads, drinks, desserts } from '../data'
import type { MenuItem, PizzaSize } from '../types'
import { useCart } from '../CartContext'

function Badge({ type, label }: { type: string; label: string }) {
  if (type === 'veg') return <span className="badge badge-veg">🥬 {label}</span>
  if (type === 'spicy') return <span className="badge badge-spicy">🌶 {label}</span>
  if (type === 'dessert') return <span className="badge badge-dessert">🍰 {label}</span>
  return null
}

function PizzaCard({ item }: { item: MenuItem }) {
  const { lang, t } = useLang()
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('M')



  const handleAdd = () => {
    addItem({
      id: `${item.id}-${selectedSize}`,
      name: { fr: item.name, en: item.name },
      size: selectedSize,
      price: item.prices![selectedSize],
      qty: 1,
    })
  }

  return (
    <div className="card overflow-hidden group flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {item.badges.map(b => (
            <Badge key={b} type={b} label={b === 'veg' ? t('menu.veg') : b === 'spicy' ? t('menu.spicy') : t('menu.dessertBadge')} />
          ))}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-lg text-brand-green uppercase tracking-wide mb-2">{item.name}</h3>
        <p className="text-olive-600 text-sm mb-3 flex-1">{item.description[lang]}</p>
        <div className="space-y-2">
          <div className="flex gap-2">
            {(['P', 'M', 'G'] as PizzaSize[]).map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedSize === size
                    ? 'bg-brand-green text-white'
                    : 'bg-olive-100 text-olive-700 hover:bg-olive-200'
                }`}
              >
                {size} · {item.prices![size]}$
              </button>
            ))}
          </div>
          <button onClick={handleAdd} className="btn-primary w-full text-sm py-2">
            {t('menu.addToCart')} · {item.prices![selectedSize]}$
          </button>
        </div>
      </div>
    </div>
  )
}

function SimpleItem({ item }: { item: MenuItem }) {
  const { lang, t } = useLang()
  const { addItem } = useCart()

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: { fr: item.name, en: item.name },
      price: item.price!,
      qty: 1,
    })
  }

  return (
    <div className="card p-5 flex items-center justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-display text-base text-brand-green uppercase tracking-wide">{item.name}</h3>
          {item.badges.map(b => (
            <Badge key={b} type={b} label={b === 'veg' ? t('menu.veg') : b === 'spicy' ? t('menu.spicy') : t('menu.dessertBadge')} />
          ))}
        </div>
        <p className="text-olive-600 text-sm">{item.description[lang]}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-brand-green font-bold text-lg">{item.price}$</span>
        <button onClick={handleAdd} className="bg-brand-green text-white rounded-lg px-3 py-2 text-sm font-semibold hover:bg-brand-green-dark transition-colors">
          +
        </button>
      </div>
    </div>
  )
}

export default function MenuPage() {
  const { t } = useLang()
  const [tab, setTab] = useState<'pizzas' | 'salads' | 'drinks' | 'desserts'>('pizzas')

  const tabs = [
    { id: 'pizzas' as const, label: t('menu.pizzas') },
    { id: 'salads' as const, label: t('menu.salads') },
    { id: 'drinks' as const, label: t('menu.drinks') },
    { id: 'desserts' as const, label: t('menu.desserts') },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="section-title">{t('menu.title')}</h1>
        <p className="section-subtitle max-w-2xl mx-auto">{t('menu.intro')}</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {tabs.map(tabItem => (
          <button
            key={tabItem.id}
            onClick={() => setTab(tabItem.id)}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
              tab === tabItem.id
                ? 'bg-brand-green text-white shadow-lg'
                : 'bg-olive-100 text-olive-700 hover:bg-olive-200'
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'pizzas' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {pizzas.map(pizza => <PizzaCard key={pizza.id} item={pizza} />)}
        </div>
      )}
      {tab === 'salads' && (
        <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
          {salads.map(item => <SimpleItem key={item.id} item={item} />)}
        </div>
      )}
      {tab === 'drinks' && (
        <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
          {drinks.map(item => <SimpleItem key={item.id} item={item} />)}
        </div>
      )}
      {tab === 'desserts' && (
        <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
          {desserts.map(item => <SimpleItem key={item.id} item={item} />)}
        </div>
      )}
    </div>
  )
}
