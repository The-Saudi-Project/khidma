import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { bookingsAPI } from '../../api'
import { formatDate, formatCurrency, getStatusConfig } from '../../utils/helpers'
import { Search, CalendarDays, ChevronRight } from 'lucide-react'
import { InlineLoader, EmptyState, Pagination, StatusBadge } from '../../components/common/LoadingSpinner'

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending_payment', label: 'Pending Payment' },
  { value: 'payment_uploaded', label: 'Payment Uploaded' },
  { value: 'payment_confirmed', label: 'Payment Confirmed' },
  { value: 'provider_assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function AdminBookingsPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings', { status, search, page }],
    queryFn: () => bookingsAPI.getAllBookings({ status: status || undefined, search: search || undefined, page, limit: 20 }),
    select: d => d.data
  })

  const bookings = data?.data?.bookings || []
  const meta = data?.meta

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Bookings</h1>
        <p className="page-subtitle">Manage all platform bookings</p>
      </div>

      {/* Search + filters */}
      <div className="flex gap-3 mb-4">
        <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1) }} className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input-glass pl-9 py-2.5 text-sm" placeholder="Search by booking # or service…"
            value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        </form>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
        {STATUS_FILTERS.map(f => (
          <button key={f.value} onClick={() => { setStatus(f.value); setPage(1) }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
              ${status === f.value ? 'bg-brand-600 text-white' : 'glass border border-white/10 text-slate-400 hover:border-brand-300'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? <InlineLoader /> : bookings.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No bookings found" />
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Booking #</th>
                <th>Service</th>
                <th>Customer</th>
                <th>Provider</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id} onClick={() => navigate(`/admin/bookings/${b._id}`)} className="cursor-pointer">
                  <td className="font-mono text-xs text-slate-500">#{b.bookingNumber}</td>
                  <td className="font-medium text-white">{b.serviceName}</td>
                  <td className="text-slate-400">{b.customer?.name}</td>
                  <td className="text-slate-500">{b.provider?.name || <span className="text-slate-300 italic">Unassigned</span>}</td>
                  <td className="text-slate-500 text-xs">{formatDate(b.scheduledDate)}</td>
                  <td className="font-semibold">{formatCurrency(b.totalAmount)}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td><ChevronRight size={14} className="text-slate-300" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination meta={meta} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
