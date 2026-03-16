import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { bookingsAPI } from '../../api'
import { formatDate, formatCurrency, getStatusConfig } from '../../utils/helpers'
import { CalendarDays, ChevronRight } from 'lucide-react'
import { InlineLoader, EmptyState, Pagination, StatusBadge } from '../../components/common/LoadingSpinner'

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending_payment', label: 'Pending Payment' },
  { value: 'payment_confirmed', label: 'Confirmed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function MyBookingsPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['my-bookings', { status, page }],
    queryFn: () => bookingsAPI.getMyBookings({ status: status || undefined, page, limit: 10 }),
    select: d => d.data
  })

  const bookings = data?.data?.bookings || []
  const meta = data?.meta

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-subtitle">Track and manage all your service bookings</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {STATUS_FILTERS.map(f => (
          <button key={f.value} onClick={() => { setStatus(f.value); setPage(1) }}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${status === f.value
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
              }`}>
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <InlineLoader />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No bookings yet"
          description="Book a home service to get started"
          action={<button onClick={() => navigate('/services')} className="btn-primary">Browse services</button>}
        />
      ) : (
        <div className="table-wrapper">
          <div className="divide-y divide-slate-50">
            {bookings.map(booking => (
              <div key={booking._id}
                onClick={() => navigate(`/bookings/${booking._id}`)}
                className="p-5 hover:bg-slate-50/60 cursor-pointer transition-colors flex items-center gap-4 group">
                {/* Status dot */}
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getStatusConfig(booking.status).dot}`} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-900">{booking.serviceName}</p>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                    <span>#{booking.bookingNumber}</span>
                    <span className="flex items-center gap-1">
                      <CalendarDays size={11} />
                      {formatDate(booking.scheduledDate)} at {booking.scheduledTime}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-slate-900">{formatCurrency(booking.totalAmount)}</p>
                </div>

                <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 flex-shrink-0 transition-colors" />
              </div>
            ))}
          </div>
          <Pagination meta={meta} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
