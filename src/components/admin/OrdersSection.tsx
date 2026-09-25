import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import type { DbOrder, DbOrderItem, DbOrderStatusChange, OrderStatus } from '../../lib/types'

const ACTIVE_STATUSES: OrderStatus[] = ['pending', 'preparing', 'done']
const CLOSED_STATUSES: OrderStatus[] = ['delivered', 'cancelled']

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  preparing: 'En préparation',
  done: 'Terminée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  preparing: 'bg-blue-100 text-blue-800',
  done: 'bg-green-100 text-green-800',
  delivered: 'bg-olive-100 text-olive-700',
  cancelled: 'bg-red-100 text-red-700',
}

type StatusFilter = 'all' | OrderStatus
type DeadlineFilter = 'all' | '15min' | '30min' | '1hour' | 'later' | 'late'
type Tab = 'active' | 'closed'

interface OrderWithItems extends DbOrder {
  order_items?: DbOrderItem[]
  order_status_changes?: DbOrderStatusChange[]
}

export default function OrdersSection() {
  const [tab, setTab] = useState<Tab>('active')
  const [orders, setOrders] = useState<DbOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  // Active filters
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [deadlineFilter, setDeadlineFilter] = useState<DeadlineFilter>('all')

  // Closed filters
  const [closedStatusFilter, setClosedStatusFilter] = useState<StatusFilter>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const PAGE_SIZE = 10

  const loadActive = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('orders')
      .select('*')
      .in('current_status', ACTIVE_STATUSES)
      .order('delivery_date', { ascending: true })
      .order('delivery_time', { ascending: true })

    if (statusFilter !== 'all') {
      query = query.eq('current_status', statusFilter)
    }

    const { data } = await query
    let result = (data as DbOrder[]) || []

    // Deadline filter (client-side since it depends on current time)
    const now = new Date()
    if (deadlineFilter !== 'all') {
      result = result.filter(o => {
        const dt = new Date(o.delivery_date + 'T' + o.delivery_time)
        const diffMin = (dt.getTime() - now.getTime()) / 60000
        if (deadlineFilter === 'late') return diffMin < 0
        if (deadlineFilter === '15min') return diffMin >= 0 && diffMin <= 15
        if (deadlineFilter === '30min') return diffMin >= 0 && diffMin <= 30
        if (deadlineFilter === '1hour') return diffMin >= 0 && diffMin <= 60
        if (deadlineFilter === 'later') return diffMin > 60
        return true
      })
    }

    setOrders(result)
    setLoading(false)
  }, [statusFilter, deadlineFilter])

  const loadClosed = useCallback(async () => {
    setLoading(true)
    let countQuery = supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .in('current_status', CLOSED_STATUSES)

    let dataQuery = supabase
      .from('orders')
      .select('*')
      .in('current_status', CLOSED_STATUSES)
      .order('closed_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (closedStatusFilter !== 'all') {
      countQuery = countQuery.eq('current_status', closedStatusFilter)
      dataQuery = dataQuery.eq('current_status', closedStatusFilter)
    }

    if (dateFrom) {
      countQuery = countQuery.gte('closed_at', dateFrom + 'T00:00:00')
      dataQuery = dataQuery.gte('closed_at', dateFrom + 'T00:00:00')
    }
    if (dateTo) {
      countQuery = countQuery.lte('closed_at', dateTo + 'T23:59:59')
      dataQuery = dataQuery.lte('closed_at', dateTo + 'T23:59:59')
    }

    const [countRes, dataRes] = await Promise.all([countQuery, dataQuery])
    setTotalCount(countRes.count || 0)
    setOrders((dataRes.data as DbOrder[]) || [])
    setLoading(false)
  }, [closedStatusFilter, dateFrom, dateTo, page])

  useEffect(() => {
    if (tab === 'active') {
      setPage(0)
      loadActive()
    } else {
      loadClosed()
    }
  }, [tab, loadActive, loadClosed])

  const refresh = () => {
    if (tab === 'active') loadActive()
    else loadClosed()
  }

  const changeStatus = async (orderId: string, newStatus: OrderStatus) => {
    await supabase.rpc('change_order_status', {
      p_order_id: orderId,
      p_status: newStatus,
    })
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, current_status: newStatus })
    }
    refresh()
  }

  const openDetail = async (order: DbOrder) => {
    setDetailLoading(true)
    const [itemsRes, statusRes] = await Promise.all([
      supabase.from('order_items').select('*').eq('order_id', order.id),
      supabase.from('order_status_changes').select('*').eq('order_id', order.id).order('created_at', { ascending: true }),
    ])
    setSelectedOrder({
      ...order,
      order_items: (itemsRes.data as DbOrderItem[]) || [],
      order_status_changes: (statusRes.data as DbOrderStatusChange[]) || [],
    })
    setDetailLoading(false)
  }

  const isLate = (o: DbOrder): boolean => {
    const dt = new Date(o.delivery_date + 'T' + o.delivery_time)
    return dt.getTime() < Date.now() && ACTIVE_STATUSES.includes(o.current_status)
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-brand-green uppercase tracking-wide">Commandes</h2>
        <button onClick={refresh} className="btn-outline text-sm py-2">
          Rafraîchir
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('active')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            tab === 'active' ? 'bg-brand-green text-white shadow-md' : 'bg-olive-100 text-olive-700 hover:bg-olive-200'
          }`}
        >
          Actives
        </button>
        <button
          onClick={() => setTab('closed')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            tab === 'closed' ? 'bg-brand-green text-white shadow-md' : 'bg-olive-100 text-olive-700 hover:bg-olive-200'
          }`}
        >
          Fermées
        </button>
      </div>

      {/* Filters */}
      {tab === 'active' ? (
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2">
            {([
              { v: 'all', l: 'Tous' },
              { v: 'pending', l: 'En attente' },
              { v: 'preparing', l: 'En préparation' },
              { v: 'done', l: 'Terminées' },
            ] as { v: StatusFilter; l: string }[]).map(f => (
              <button
                key={f.v}
                onClick={() => setStatusFilter(f.v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === f.v ? 'bg-olive-700 text-white' : 'bg-olive-100 text-olive-600 hover:bg-olive-200'
                }`}
              >
                {f.l}
              </button>
            ))}
          </div>
          <div className="h-5 w-px bg-olive-200" />
          <div className="flex gap-2">
            {([
              { v: 'all', l: 'Toutes échéances' },
              { v: '15min', l: '15 min' },
              { v: '30min', l: '30 min' },
              { v: '1hour', l: '1 heure' },
              { v: 'later', l: 'Plus tard' },
              { v: 'late', l: 'En retard' },
            ] as { v: DeadlineFilter; l: string }[]).map(f => (
              <button
                key={f.v}
                onClick={() => setDeadlineFilter(f.v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  deadlineFilter === f.v ? 'bg-amber-600 text-white' : 'bg-olive-100 text-olive-600 hover:bg-olive-200'
                }`}
              >
                {f.l}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-olive-700 mb-1">Statut</label>
            <select
              value={closedStatusFilter}
              onChange={e => { setClosedStatusFilter(e.target.value as StatusFilter); setPage(0) }}
              className="rounded-lg border border-olive-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            >
              <option value="all">Toutes</option>
              <option value="delivered">Livrées</option>
              <option value="cancelled">Annulées</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-olive-700 mb-1">Du</label>
            <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(0) }}
              className="rounded-lg border border-olive-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-olive-700 mb-1">Au</label>
            <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(0) }}
              className="rounded-lg border border-olive-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
          </div>
        </div>
      )}

      {/* Orders list */}
      {loading ? (
        <p className="text-olive-600">Chargement...</p>
      ) : orders.length === 0 ? (
        <p className="text-olive-500 italic">Aucune commande {tab === 'active' ? 'active' : 'fermée'}.</p>
      ) : (
        <div className="space-y-2">
          {orders.map(order => {
            const late = isLate(order)
            return (
              <div
                key={order.id}
                onClick={() => openDetail(order)}
                className={`card p-4 cursor-pointer hover:shadow-md transition-all ${late ? 'bg-rose-50' : ''}`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <div className="font-display text-lg text-brand-green font-bold">#{order.order_number}</div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.current_status]}`}>
                    {STATUS_LABELS[order.current_status]}
                  </span>
                  {late && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-200 text-rose-800">
                      En retard
                    </span>
                  )}
                  <div className="flex-1" />
                  <div className="text-sm text-olive-700">
                    <span className="font-semibold">{order.customer_name}</span>
                    <span className="text-olive-400 mx-1">·</span>
                    {order.mode === 'delivery' ? 'Livraison' : 'Cueillette'}
                  </div>
                  <div className="text-sm text-olive-600 font-medium">
                    {order.delivery_date} à {order.delivery_time}
                  </div>
                  <select
                    value={order.current_status}
                    onClick={e => e.stopPropagation()}
                    onChange={e => { e.stopPropagation(); changeStatus(order.id, e.target.value as OrderStatus) }}
                    className="rounded-lg border border-olive-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-brand-green"
                  >
                    <option value="pending">En attente</option>
                    <option value="preparing">En préparation</option>
                    <option value="done">Terminée</option>
                    <option value="delivered">Livrée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination for closed tab */}
      {tab === 'closed' && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="btn-outline text-sm py-1.5 px-3 disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="text-sm text-olive-600">
            Page {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="btn-outline text-sm py-1.5 px-3 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}

      {/* Detail modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-cream-50 rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6"
            onClick={e => e.stopPropagation()}
          >
            {detailLoading ? (
              <p className="text-olive-600">Chargement...</p>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-2xl text-brand-green font-bold">
                    Commande #{selectedOrder.order_number}
                  </h3>
                  <button onClick={() => setSelectedOrder(null)} className="text-olive-500 hover:text-olive-700 text-xl">
                    ✕
                  </button>
                </div>

                <div className="space-y-4 text-sm">
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[selectedOrder.current_status]}`}>
                      {STATUS_LABELS[selectedOrder.current_status]}
                    </span>
                    {isLate(selectedOrder) && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-200 text-rose-800">
                        En retard
                      </span>
                    )}
                  </div>

                  {/* Delivery info */}
                  <div className="border-b border-olive-100 pb-3">
                    <p className="font-semibold text-olive-800">
                      {selectedOrder.mode === 'delivery' ? 'Livraison' : 'Cueillette'}
                    </p>
                    <p className="text-olive-600">{selectedOrder.delivery_date} à {selectedOrder.delivery_time}</p>
                    <p className="text-olive-500 text-xs mt-1">
                      Langue: {selectedOrder.lang === 'fr' ? 'Français' : 'Anglais'}
                    </p>
                  </div>

                  {/* Customer */}
                  <div className="border-b border-olive-100 pb-3">
                    <h4 className="font-semibold text-olive-800 mb-1">Client</h4>
                    <p>{selectedOrder.customer_name}</p>
                    <p>{selectedOrder.customer_phone}</p>
                    {selectedOrder.customer_email && <p>{selectedOrder.customer_email}</p>}
                    {selectedOrder.customer_address && <p>{selectedOrder.customer_address}</p>}
                  </div>

                  {/* Items */}
                  <div className="border-b border-olive-100 pb-3">
                    <h4 className="font-semibold text-olive-800 mb-2">Articles</h4>
                    <div className="space-y-1.5">
                      {selectedOrder.order_items?.map(item => (
                        <div key={item.id} className="flex justify-between">
                          <span>
                            {item.name_fr}
                            {item.size && ` (${item.size})`} ×{item.qty}
                          </span>
                          <span className="font-medium">{(item.price * item.qty).toFixed(2)}$</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="space-y-1 border-b border-olive-100 pb-3">
                    <div className="flex justify-between"><span className="text-olive-600">Sous-total</span><span>{selectedOrder.subtotal.toFixed(2)}$</span></div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-brand-green">
                        <span>Rabais ({selectedOrder.promo_code})</span>
                        <span>−{selectedOrder.discount.toFixed(2)}$</span>
                      </div>
                    )}
                    <div className="flex justify-between"><span className="text-olive-600">TPS (5%)</span><span>{selectedOrder.tps.toFixed(2)}$</span></div>
                    <div className="flex justify-between"><span className="text-olive-600">TVQ (9.975%)</span><span>{selectedOrder.tvq.toFixed(2)}$</span></div>
                    <div className="flex justify-between font-bold text-base pt-1"><span className="text-brand-green">Total</span><span className="text-brand-green">{selectedOrder.total.toFixed(2)}$</span></div>
                  </div>

                  {/* Notes */}
                  {selectedOrder.notes && (
                    <div className="border-b border-olive-100 pb-3">
                      <h4 className="font-semibold text-olive-800 mb-1">Notes</h4>
                      <p className="text-olive-700">{selectedOrder.notes}</p>
                    </div>
                  )}

                  {/* Status history */}
                  <div>
                    <h4 className="font-semibold text-olive-800 mb-2">Historique des statuts</h4>
                    <div className="space-y-1">
                      {selectedOrder.order_status_changes?.map(sc => (
                        <div key={sc.id} className="flex items-center gap-2 text-xs">
                          <span className={`px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[sc.status]}`}>
                            {STATUS_LABELS[sc.status]}
                          </span>
                          <span className="text-olive-500">
                            {new Date(sc.created_at).toLocaleString('fr-CA')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Change status */}
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-olive-700 mb-1">Changer le statut</label>
                    <select
                      value={selectedOrder.current_status}
                      onChange={e => changeStatus(selectedOrder.id, e.target.value as OrderStatus)}
                      className="w-full rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                    >
                      <option value="pending">En attente</option>
                      <option value="preparing">En préparation</option>
                      <option value="done">Terminée</option>
                      <option value="delivered">Livrée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
