import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { bookingsAPI } from '../../api'
import { formatCurrency, formatDate, getStatusConfig } from '../../utils/helpers'
import { CalendarDays, CheckCircle, XCircle, Clock, DollarSign, TrendingUp, ChevronRight, Activity } from 'lucide-react'
import { InlineLoader, StatCard, StatusBadge } from '../../components/common/LoadingSpinner'

export default function AdminDashboard() {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: () => bookingsAPI.getAdminMetrics(),
    select: d => d.data.data,
    refetchInterval: 60000
  })

  if (isLoading) return <InlineLoader />

  const { metrics, recentBookings } = data || {}

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Platform overview — live metrics</p>
      </div>

      {/* Revenue row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <StatCard label="Total Revenue" icon={DollarSign} color="green"
          value={formatCurrency(metrics?.totalRevenue || 0)} trend="Completed bookings" />
        <StatCard label="Platform Revenue" icon={TrendingUp} color="blue"
          value={formatCurrency(metrics?.platformRevenue || 0)} trend="30% commission" />
        <StatCard label="Provider Payouts" icon={Activity} color="purple"
          value={formatCurrency(metrics?.providerPayouts || 0)} trend="70% to providers" />
      </div>

      {/* Booking stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Bookings" icon={CalendarDays} color="blue"
          value={(metrics?.totalBookings || 0).toLocaleString()} />
        <StatCard label="Active" icon={Clock} color="yellow"
          value={(metrics?.activeBookings || 0).toLocaleString()} />
        <StatCard label="Completed" icon={CheckCircle} color="green"
          value={(metrics?.completedBookings || 0).toLocaleString()} />
        <StatCard label="Cancelled" icon={XCircle} color="red"
          value={(metrics?.cancelledBookings || 0).toLocaleString()} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Review Payments', desc: 'Confirm proof uploads', path: '/admin/payments', color: 'bg-amber-50 text-amber-700 border-amber-100' },
          { label: 'Assign Providers', desc: 'Pending assignments', path: '/admin/bookings', color: 'bg-brand-50 text-brand-700 border-brand-100' },
          { label: 'Process Payouts', desc: 'Pay provider earnings', path: '/admin/payouts', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
          { label: 'Support Tickets', desc: 'Open tickets', path: '/admin/support', color: 'bg-purple-50 text-purple-700 border-purple-100' },
        ].map(a => (
          <button key={a.path} onClick={() => navigate(a.path)}
            className={`p-4 rounded-2xl border text-left hover:shadow-md transition-all ${a.color}`}>
            <p className="font-semibold text-sm">{a.label}</p>
            <p className="text-xs opacity-70 mt-0.5">{a.desc}</p>
          </button>
        ))}
      </div>

      {/* Recent bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Bookings</h2>
          <button onClick={() => navigate('/admin/bookings')}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
            View all <ChevronRight size={14} />
          </button>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Service</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings?.map(b => (
                <tr key={b._id} onClick={() => navigate(`/admin/bookings/${b._id}`)} className="cursor-pointer">
                  <td className="font-mono text-xs text-slate-500">#{b.bookingNumber}</td>
                  <td className="font-medium text-slate-900">{b.serviceName}</td>
                  <td className="text-slate-600">{b.customer?.name}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td className="font-semibold">{formatCurrency(b.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
