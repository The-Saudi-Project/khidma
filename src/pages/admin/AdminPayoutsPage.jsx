import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { payoutsAPI } from '../../api'
import { formatCurrency, formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { DollarSign, ChevronDown, ChevronUp, Loader2, CheckCircle } from 'lucide-react'
import { InlineLoader, EmptyState, Avatar } from '../../components/common/LoadingSpinner'

export default function AdminPayoutsPage() {
  const qc = useQueryClient()
  const [expandedProvider, setExpandedProvider] = useState(null)
  const [payoutState, setPayoutState] = useState({}) // providerId -> { selected, method, ref, processing }

  const { data: balances, isLoading } = useQuery({
    queryKey: ['provider-balances'],
    queryFn: () => payoutsAPI.getProviderBalances(),
    select: d => d.data.data.providers
  })

  const { data: payoutHistory } = useQuery({
    queryKey: ['all-payouts'],
    queryFn: () => payoutsAPI.getAllPayouts({ limit: 20 }),
    select: d => d.data.data.payouts
  })

  const { data: earningsData } = useQuery({
    queryKey: ['provider-earnings-admin', expandedProvider],
    queryFn: () => {
      // We'll fetch pending bookings via balances — use a mock approach since we
      // need per-provider bookings. For each expanded provider call getProviderEarnings
      // by temporarily using admin endpoint — in production you'd add an admin/:id/earnings route
      return Promise.resolve({ data: { data: { pendingBookings: [] } } })
    },
    enabled: !!expandedProvider
  })

  const handleProcessPayout = async (providerId) => {
    const state = payoutState[providerId] || {}
    if (!state.selected?.length) return toast.error('Select bookings to pay out')

    setPayoutState(s => ({ ...s, [providerId]: { ...s[providerId], processing: true } }))
    try {
      await payoutsAPI.processPayout({
        providerId,
        bookingIds: state.selected,
        method: state.method || 'bank_transfer',
        transactionReference: state.ref || ''
      })
      toast.success('Payout processed!')
      qc.invalidateQueries(['provider-balances'])
      qc.invalidateQueries(['all-payouts'])
      setExpandedProvider(null)
    } catch { toast.error('Failed to process payout.') }
    finally {
      setPayoutState(s => ({ ...s, [providerId]: { ...s[providerId], processing: false } }))
    }
  }

  if (isLoading) return <InlineLoader />

  const providersWithBalance = balances?.filter(p => (p.providerProfile?.pendingEarnings || 0) > 0) || []
  const allProviders = balances || []

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Payouts</h1>
        <p className="page-subtitle">Manage provider earnings and process payouts</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <p className="stat-label">Total Pending</p>
          <p className="stat-value text-amber-600">
            {formatCurrency(allProviders.reduce((s, p) => s + (p.providerProfile?.pendingEarnings || 0), 0))}
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Providers with Balance</p>
          <p className="stat-value">{providersWithBalance.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Paid Out</p>
          <p className="stat-value text-emerald-600">
            {formatCurrency(allProviders.reduce((s, p) => s + (p.providerProfile?.totalPaidOut || 0), 0))}
          </p>
        </div>
      </div>

      {/* Providers with pending earnings */}
      <h2 className="text-lg font-bold text-white mb-4">Providers Awaiting Payment</h2>

      {providersWithBalance.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <CheckCircle size={28} className="text-emerald-400 mx-auto mb-3" />
          <p className="font-semibold text-slate-300">All providers are paid up</p>
          <p className="text-sm text-slate-400 mt-1">No pending payouts at the moment</p>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {providersWithBalance.map(provider => {
            const isExpanded = expandedProvider === provider._id
            const pending = provider.providerProfile?.pendingEarnings || 0
            const state = payoutState[provider._id] || {}

            return (
              <div key={provider._id} className="glass-card overflow-hidden">
                <button onClick={() => setExpandedProvider(isExpanded ? null : provider._id)}
                  className="w-full p-5 flex items-center gap-4 hover:bg-white/5 transition-colors text-left">
                  <Avatar name={provider.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white">{provider.name}</p>
                    <p className="text-xs text-slate-400">{provider.email}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-amber-600 text-lg">{formatCurrency(pending)}</p>
                    <p className="text-xs text-slate-400">pending</p>
                  </div>
                  {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-white/5 p-5 animate-slide-up">
                    <p className="text-sm text-slate-500 mb-4">
                      Select completed bookings to include in this payout:
                    </p>

                    <div className="space-y-2 mb-4">
                      {/* In a full implementation, fetch per-provider pending bookings here */}
                      <div className="text-sm text-slate-400 italic p-3 glass rounded-2xl">
                        Booking list requires admin/provider earning endpoint — connect to
                        <code className="text-brand-600 ml-1">/api/payouts/admin/balances</code> with booking IDs.
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="label">Payment method</label>
                        <select className="input"
                          value={state.method || 'bank_transfer'}
                          onChange={e => setPayoutState(s => ({ ...s, [provider._id]: { ...s[provider._id], method: e.target.value } }))}>
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="stc_pay">STC Pay</option>
                          <option value="mada">Mada</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">Transaction reference</label>
                        <input className="input" placeholder="Optional reference"
                          value={state.ref || ''}
                          onChange={e => setPayoutState(s => ({ ...s, [provider._id]: { ...s[provider._id], ref: e.target.value } }))} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl mb-4">
                      <span className="text-sm font-medium text-emerald-700">Payout amount</span>
                      <span className="font-bold text-emerald-700">{formatCurrency(pending)}</span>
                    </div>

                    <button
                      onClick={() => handleProcessPayout(provider._id)}
                      disabled={state.processing}
                      className="btn-primary w-full justify-center gap-2">
                      {state.processing ? <Loader2 size={16} className="animate-spin" /> :
                        <><DollarSign size={16} /> Process Full Payout ({formatCurrency(pending)})</>}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Payout history */}
      <h2 className="text-lg font-bold text-white mb-4">Payout History</h2>
      {!payoutHistory?.length ? (
        <div className="glass-card p-6 text-center text-slate-400 text-sm">No payouts processed yet</div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Date</th><th>Provider</th><th>Method</th><th>Amount</th><th>Reference</th><th>Processed by</th></tr>
            </thead>
            <tbody>
              {payoutHistory.map(p => (
                <tr key={p._id}>
                  <td className="text-slate-500 text-sm">{formatDate(p.createdAt)}</td>
                  <td>
                    <p className="font-medium text-white">{p.provider?.name}</p>
                    <p className="text-xs text-slate-400">{p.provider?.email}</p>
                  </td>
                  <td className="capitalize text-slate-400">{p.method?.replace('_', ' ')}</td>
                  <td className="font-bold text-emerald-600">{formatCurrency(p.amount)}</td>
                  <td className="text-slate-400 font-mono text-xs">{p.transactionReference || '—'}</td>
                  <td className="text-slate-500 text-sm">{p.processedBy?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
