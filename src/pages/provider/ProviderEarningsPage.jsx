import { useQuery } from '@tanstack/react-query'
import { payoutsAPI } from '../../api'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { DollarSign, Clock, TrendingUp, ChevronRight } from 'lucide-react'
import { InlineLoader, StatCard, EmptyState, StatusBadge } from '../../components/common/LoadingSpinner'

export default function ProviderEarningsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['provider-earnings'],
    queryFn: () => payoutsAPI.getProviderEarnings(),
    select: d => d.data.data
  })

  const { data: payoutHistory } = useQuery({
    queryKey: ['provider-payout-history'],
    queryFn: () => payoutsAPI.getProviderPayoutHistory(),
    select: d => d.data.data.payouts
  })

  if (isLoading) return <InlineLoader />

  const summary = data?.summary || {}
  const pendingBookings = data?.pendingBookings || []

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Earnings</h1>
        <p className="page-subtitle">Your earnings and payout history</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Earned" icon={TrendingUp} color="green"
          value={formatCurrency(summary.totalEarned || 0)} />
        <StatCard label="Pending Payout" icon={Clock} color="yellow"
          value={formatCurrency(summary.pendingEarnings || 0)} />
        <StatCard label="Total Paid Out" icon={DollarSign} color="blue"
          value={formatCurrency(summary.totalPaidOut || 0)} />
      </div>

      {/* Pending bookings */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Pending Payments ({pendingBookings.length})</h2>
        {pendingBookings.length === 0 ? (
          <div className="card p-6 text-center text-slate-400 text-sm">No pending payments</div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Your Earning</th>
                </tr>
              </thead>
              <tbody>
                {pendingBookings.map(b => (
                  <tr key={b._id}>
                    <td className="font-mono text-xs text-slate-500">#{b.bookingNumber}</td>
                    <td className="font-medium text-slate-900">{b.serviceName}</td>
                    <td className="text-slate-500">{formatDate(b.scheduledDate)}</td>
                    <td className="font-bold text-emerald-600">{formatCurrency(b.providerEarning)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payout history */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Payout History</h2>
        {!payoutHistory || payoutHistory.length === 0 ? (
          <div className="card p-6 text-center text-slate-400 text-sm">No payouts yet</div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr><th>Date</th><th>Method</th><th>Bookings</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {payoutHistory.map(p => (
                  <tr key={p._id}>
                    <td className="text-slate-500">{formatDate(p.createdAt)}</td>
                    <td className="capitalize text-slate-700">{p.method?.replace('_', ' ')}</td>
                    <td className="text-slate-500">{p.bookings?.length || 0} jobs</td>
                    <td className="font-bold text-emerald-600">{formatCurrency(p.amount)}</td>
                    <td><StatusBadge status={p.status} type="payment" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
