import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { bookingsAPI } from '../../api'
import { formatDate, formatDateTime, formatCurrency, TIMELINE_LABELS } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { ArrowLeft, MapPin, User, Phone, Calendar, Clock, Play, CheckCircle, Loader2 } from 'lucide-react'
import { InlineLoader, StatusBadge } from '../../components/common/LoadingSpinner'

export default function ProviderJobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [actionLoading, setActionLoading] = useState(false)

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingsAPI.getBooking(id),
    select: d => d.data.data.booking
  })

  const refetch = () => qc.invalidateQueries(['booking', id])

  useEffect(() => {
    if (!id) return undefined
    const token = localStorage.getItem('accessToken')
    if (!token) return undefined
    const url = `${window.location.origin}/api/bookings/${id}/events?access_token=${encodeURIComponent(token)}`
    const es = new EventSource(url)
    es.onmessage = () => {
      qc.invalidateQueries(['booking', id])
    }
    es.onerror = () => {
      es.close()
    }
    return () => {
      es.close()
    }
  }, [id, qc])

  const handleAccept = async () => {
    setActionLoading(true)
    try {
      await bookingsAPI.acceptJob(id)
      toast.success('Job accepted!')
      refetch()
    } catch {
      toast.error('Could not accept job.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleStart = async () => {
    setActionLoading(true)
    try {
      await bookingsAPI.startJob(id)
      toast.success('Job started!')
      refetch()
    } catch { toast.error('Failed to start job.') }
    finally { setActionLoading(false) }
  }

  const handleComplete = async () => {
    setActionLoading(true)
    try {
      await bookingsAPI.completeJob(id)
      toast.success('Job marked as complete!')
      refetch()
    } catch { toast.error('Failed to complete job.') }
    finally { setActionLoading(false) }
  }

  if (isLoading) return <InlineLoader />
  if (!booking) return <div className="text-center py-20 text-slate-400">Job not found.</div>

  return (
    <div className="animate-fade-in max-w-xl">
      <button onClick={() => navigate('/provider/jobs')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft size={16} /> Back to jobs
      </button>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{booking.serviceName}</h1>
          <p className="text-sm text-slate-400 mt-1">#{booking.bookingNumber}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Action buttons */}
      {booking.status === 'provider_assigned' && !booking.providerAcceptedAt && (
        <button type="button" onClick={handleAccept} disabled={actionLoading}
          className="w-full mb-3 py-4 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-base flex items-center justify-center gap-3 transition-colors">
          {actionLoading ? <Loader2 size={18} className="animate-spin" /> : 'Accept Job'}
        </button>
      )}
      {booking.status === 'provider_assigned' && booking.providerAcceptedAt && (
        <button type="button" onClick={handleStart} disabled={actionLoading}
          className="btn-primary btn-lg w-full mb-4 gap-3">
          {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <><Play size={18} /> Start Job</>}
        </button>
      )}

      {booking.status === 'in_progress' && (
        <button onClick={handleComplete} disabled={actionLoading}
          className="w-full mb-4 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base flex items-center justify-center gap-3 transition-colors shadow-sm">
          {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle size={18} /> Mark as Complete</>}
        </button>
      )}

      {/* Earnings card */}
      <div className="card p-5 mb-4 bg-emerald-50 border-emerald-100">
        <p className="text-sm text-emerald-700 font-medium mb-1">Your Earnings</p>
        <p className="text-3xl font-bold text-emerald-700">{formatCurrency(booking.providerEarning)}</p>
        <p className="text-xs text-emerald-600 mt-1">
          70% of {formatCurrency(booking.totalAmount)} total · Platform fee: {formatCurrency(booking.platformCommission)}
        </p>
        <p className="text-xs text-emerald-600 mt-1">
          {booking.isProviderPaid ? '✓ Paid out' : 'Will be paid after completion'}
        </p>
      </div>

      {/* Job details */}
      <div className="card p-5 mb-4 space-y-3">
        <h3 className="section-title">Job Details</h3>
        <DetailRow icon={Calendar} label="Date" value={formatDate(booking.scheduledDate)} />
        <DetailRow icon={Clock} label="Time" value={booking.scheduledTime} />
        <DetailRow icon={MapPin} label="Address"
          value={`${booking.address.fullAddress}, ${booking.address.city}`} />
        {booking.address.landmark && (
          <DetailRow icon={MapPin} label="Landmark" value={booking.address.landmark} />
        )}
        {booking.notes && <DetailRow icon={null} label="Notes" value={booking.notes} />}
      </div>

      {/* Customer info */}
      <div className="card p-5 mb-4 space-y-3">
        <h3 className="section-title">Customer</h3>
        <DetailRow icon={User} label="Name" value={booking.customer?.name} />
        {booking.customer?.phone && (
          <DetailRow icon={Phone} label="Phone" value={booking.customer.phone} />
        )}
      </div>

      {/* Timeline */}
      <div className="card p-5">
        <h3 className="section-title">Timeline</h3>
        <div className="space-y-3">
          {booking.timeline?.map((e, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-brand-400 mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-800">{TIMELINE_LABELS[e.status] || e.status}</p>
                <p className="text-xs text-slate-400">{formatDateTime(e.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      {Icon && <Icon size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />}
      <span className="text-slate-500 flex-shrink-0">{label}:</span>
      <span className="text-slate-800 font-medium">{value}</span>
    </div>
  )
}
