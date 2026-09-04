import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../LanguageContext'
import { useCart } from '../CartContext'
import { promoCodes } from '../data'

export default function OrderPage() {
  const { lang, t } = useLang()
  const { items, removeItem, updateQty, clear } = useCart()

  const [mode, setMode] = useState<'delivery' | 'pickup'>('delivery')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [promoInput, setPromoInput] = useState('')
  const [promoApplied, setPromoApplied] = useState<number | null>(null)
  const [promoMsg, setPromoMsg] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', address: '', notes: '' })

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items])
  const discount = promoApplied ? subtotal * promoApplied : 0
  const total = subtotal - discount

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (promoCodes[code]) {
      setPromoApplied(promoCodes[code])
      setPromoMsg(t('order.promoApplied'))
    } else {
      setPromoApplied(null)
      setPromoMsg(t('order.invalidPromo'))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setConfirmed(true)
    clear()
  }

  if (confirmed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="card p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-green flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="section-title">{t('order.orderConfirmed')}</h1>
          <p className="text-olive-700 text-lg mb-6">{t('order.confirmMsg')}</p>
          <Link to="/" className="btn-primary">{t('nav.home')}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="section-title text-center">{t('order.title')}</h1>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        {/* Left: Order details + customer info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery / Pickup */}
          <div className="card p-6">
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setMode('delivery')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  mode === 'delivery' ? 'bg-brand-green text-white' : 'bg-olive-100 text-olive-700 hover:bg-olive-200'
                }`}
              >
                🛵 {t('order.delivery')}
              </button>
              <button
                onClick={() => setMode('pickup')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  mode === 'pickup' ? 'bg-brand-green text-white' : 'bg-olive-100 text-olive-700 hover:bg-olive-200'
                }`}
              >
                🏪 {t('order.pickup')}
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-olive-700 mb-1">{t('order.date')}</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                  className="w-full rounded-lg border border-olive-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-olive-700 mb-1">{t('order.time')}</label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)} required
                  className="w-full rounded-lg border border-olive-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green" />
              </div>
            </div>
          </div>

          {/* Customer info */}
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <h2 className="font-display text-xl text-brand-green uppercase tracking-wide">{t('order.customerInfo')}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-olive-700 mb-1">{t('order.name')}</label>
                <input type="text" required value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})}
                  className="w-full rounded-lg border border-olive-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-olive-700 mb-1">{t('order.phone')}</label>
                <input type="tel" required value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})}
                  className="w-full rounded-lg border border-olive-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-olive-700 mb-1">{t('order.email')}</label>
              <input type="email" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})}
                className="w-full rounded-lg border border-olive-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
            {mode === 'delivery' && (
              <div>
                <label className="block text-sm font-semibold text-olive-700 mb-1">{t('order.address')}</label>
                <input type="text" required value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})}
                  className="w-full rounded-lg border border-olive-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green" />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-olive-700 mb-1">{t('order.notes')}</label>
              <textarea rows={3} value={customer.notes} onChange={e => setCustomer({...customer, notes: e.target.value})}
                className="w-full rounded-lg border border-olive-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>

            <p className="text-sm text-olive-500 italic">{t('order.paymentLater')}</p>

            <button type="submit" disabled={items.length === 0}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
              {t('order.placeOrder')}
            </button>
          </form>
        </div>

        {/* Right: Cart */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display text-xl text-brand-green uppercase tracking-wide mb-4">{t('order.cart')}</h2>

            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-olive-500 mb-4">{t('order.emptyCart')}</p>
                <Link to="/menu" className="btn-outline text-sm">{t('order.browseMenu')}</Link>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between gap-2 text-sm">
                      <div className="flex-1">
                        <p className="font-semibold text-olive-800">{item.name[lang]} {item.size && `(${item.size})`}</p>
                        <p className="text-olive-500">{item.price}$ × {item.qty}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 rounded bg-olive-100 text-olive-700 hover:bg-olive-200 font-bold">−</button>
                        <span className="w-8 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 rounded bg-olive-100 text-olive-700 hover:bg-olive-200 font-bold">+</button>
                        <button onClick={() => removeItem(item.id)} className="ml-1 text-brick-500 hover:text-brick-700 text-xs">{t('order.removeItem')}</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo code */}
                <div className="border-t border-olive-100 pt-4 mb-4">
                  <label className="block text-sm font-semibold text-olive-700 mb-1">{t('order.promoCode')}</label>
                  <div className="flex gap-2">
                    <input type="text" value={promoInput} onChange={e => setPromoInput(e.target.value)}
                      className="flex-1 rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
                    <button onClick={handleApplyPromo} className="btn-secondary text-sm py-2 px-4">{t('order.apply')}</button>
                  </div>
                  {promoMsg && <p className={`text-xs mt-1 ${promoApplied ? 'text-brand-green' : 'text-brick-600'}`}>{promoMsg}</p>}
                </div>

                {/* Totals */}
                <div className="border-t border-olive-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-olive-600">{t('order.subtotal')}</span>
                    <span className="font-semibold text-olive-800">{subtotal.toFixed(2)}$</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-green">{t('order.discount')} ({(promoApplied! * 100)}%)</span>
                      <span className="font-semibold text-brand-green">−{discount.toFixed(2)}$</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-olive-100">
                    <span className="text-brand-green">{t('order.total')}</span>
                    <span className="text-brand-green">{total.toFixed(2)}$</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
