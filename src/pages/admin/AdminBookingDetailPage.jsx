import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { bookingsAPI, paymentsAPI, usersAPI } from '../../api'
import { formatDate, formatDateTime, formatCurrency, TIMELINE_LABELS } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { ArrowLeft, CheckCircle, XCircle, UserCheck, ExternalLink, Loader2, MapPin, Calendar, Clock } from 'lucide-react'
import { InlineLoader, StatusBadge, ConfirmModal } from '../../components/common/LoadingSpinner'

export default function AdminBookingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [confirmingPayment, setConfirmingPayment] = useState(false)
  const [rejectingPayment, setRejectingPayment] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const { data: booking, isLoading } = useQuery({
    queryKey: ['admin-booking', id],
    queryFn: () => bookingsAPI.getBooking(id),
    select: d => d.data.data.booking
  })

  const { data: providers } = useQuery({
    queryKey: ['providers-list'],
    queryFn: () => usersAPI.getProviders({ isActive: true }),
    select: d => d.data.data.providers
  })

  const refetch = () => {
    qc.invalidateQueries(['admin-booking', id])
    qc.invalidateQueries(['admin-bookings'])
  }

  const handleConfirmPayment = async () => {
    if (!booking.paymentId) return toast.error('No payment to confirm')
    setConfirmingPayment(true)
    try {
      await paymentsAPI.confirmPayment(booking.paymentId._id || booking.paymentId)
      toast.success('Payment confirmed!')
      refetch()
    } catch { toast.error('Failed to confirm payment.') }
    finally { setConfirmingPayment(false) }
  }

  const handleRejectPayment = async () => {
    if (!rejectReason.trim()) return toast.error('Rejection reason required')
    setRejectingPayment(true)
    try {
      await paymentsAPI.rejectPayment(booking.paymentId._id || booking.paymentId, rejectReason)
      toast.success('Payment rejected.')
      setShowRejectModal(false)
      setRejectReason('')
      refetch()
    } catch { toast.error('Failed to reject payment.') }
    finally { setRejectingPayment(false) }
  }

  const handleAssignProvider = async () => {
    if (!selectedProvider) return toast.error('Please select a provider')
    setAssigning(true)
    try {
      await bookingsAPI.assignProvider(id, selectedProvider)
      toast.success('Provider assigned!')
      refetch()
    } catch { toast.error('Failed to assign provider.') }
    finally { setAssigning(false) }
  }

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await bookingsAPI.cancelBooking(id, 'Cancelled by admin')
      toast.success('Booking cancelled.')
      setShowCancelModal(false)
      refetch()
    } catch { toast.error('Failed to cancel.') }
    finally { setCancelling(false) }
  }

  if (isLoading) return <InlineLoader />
  if (!booking) return <div className="text-center py-20 text-slate-400">Booking not found.</div>

  const paymentObj = booking.paymentId

  return (
    <div className="animate-fade-in max-w-3xl">
      <button onClick={() => navigate('/admin/bookings')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft size={16} /> Back to bookings
      </button>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{booking.serviceName}</h1>
          <p className="text-sm text-slate-400 mt-1">#{booking.bookingNumber}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Main details */}
        <div className="lg:col-span-2 space-y-4">

          {/* Financial snapshot */}
          <div className="card p-5">
            <h3 className="section-title">Financial Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Total Charged</span><span className="font-bold text-slate-900">{formatCurrency(booking.totalAmount)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Platform Commission (30%)</span><span className="text-slate-700">{formatCurrency(booking.platformCommission)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Provider Earning (70%)</span><span className="text-emerald-600 font-semibold">{formatCurrency(booking.providerEarning)}</span></div>
            </div>
          </div>

          {/* Payment review */}
          {booking.status === 'payment_uploaded' && paymentObj && (
            <div className="card p-5 border-amber-200">
              <h3 className="section-title flex items-center gap-2 text-amber-800">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Payment Proof Review
              </h3>
              {paymentObj.proofFile && (
                <a href={paymentObj.proofFile.path} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 mb-4 font-medium">
                  <ExternalLink size={14} /> View uploaded proof
                </a>
              )}
              {paymentObj.transactionReference && (
                <p className="text-sm text-slate-600 mb-4">Ref: <strong>{paymentObj.transactionReference}</strong></p>
              )}
              <div className="flex gap-2">
                <button onClick={handleConfirmPayment} disabled={confirmingPayment}
                  className="btn-primary flex-1 justify-center gap-2">
                  {confirmingPayment ? <Loader2 size={15} className="animate-spin" /> : <><CheckCircle size={15} /> Confirm Payment</>}
                </button>
                <button onClick={() => setShowRejectModal(true)}
                  className="btn-danger flex-1 justify-center gap-2">
                  <XCircle size={15} /> Reject
                </button>
              </div>
            </div>
          )}

          {/* Assign provider */}
          {booking.status === 'payment_confirmed' && (
            <div className="card p-5 border-brand-100">
              <h3 className="section-title">Assign Provider</h3>
              <select className="input mb-3" value={selectedProvider}
                onChange={e => setSelectedProvider(e.target.value)}>
                <option value="">Select a provider…</option>
                {providers?.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name} — {p.providerProfile?.skills?.join(', ')} ({p.providerProfile?.averageRating || 0}★)
                  </option>
                ))}
              </select>
              <button onClick={handleAssignProvider} disabled={assigning || !selectedProvider}
                className="btn-primary w-full justify-center gap-2">
                {assigning ? <Loader2 size={15} className="animate-spin" /> : <><UserCheck size={15} /> Assign Provider</>}
              </button>
            </div>
          )}

          {/* Reassign provider */}
          {booking.status === 'provider_assigned' && (
            <div className="card p-5">
              <h3 className="section-title">Reassign Provider</h3>
              <select className="input mb-3" value={selectedProvider}
                onChange={e => setSelectedProvider(e.target.value)}>
                <option value="">Select a different provider…</option>
                {providers?.filter(p => p._id.toString() !== booking.provider?._id?.toString()).map(p => (
                  <option key={p._id} value={p._id}>{p.name} — {p.providerProfile?.skills?.join(', ')}</option>
                ))}
              </select>
              <button onClick={handleAssignProvider} disabled={assigning || !selectedProvider}
                className="btn-secondary w-full justify-center gap-2">
                {assigning ? <Loader2 size={15} className="animate-spin" /> : <><UserCheck size={15} /> Reassign</>}
              </button>
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* Booking info */}
          <div className="card p-4 space-y-3 text-sm">
            <h3 className="section-title text-sm">Booking Info</h3>
            <div className="flex items-start gap-2">
              <Calendar size={13} className="text-slate-400 mt-0.5" />
              <span className="text-slate-700">{formatDate(booking.scheduledDate)} · {booking.scheduledTime}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={13} className="text-slate-400 mt-0.5" />
              <span className="text-slate-700">{booking.address.fullAddress}</span>
            </div>
          </div>

          {/* Customer */}
          <div className="card p-4 text-sm space-y-2">
            <h3 className="section-title text-sm">Customer</h3>
            <p className="font-medium text-slate-900">{booking.customer?.name}</p>
            <p className="text-slate-500">{booking.customer?.email}</p>
            {booking.customer?.phone && <p className="text-slate-500">{booking.customer.phone}</p>}
          </div>

          {/* Provider */}
          {booking.provider && (
            <div className="card p-4 text-sm space-y-2">
              <h3 className="section-title text-sm">Provider</h3>
              <p className="font-medium text-slate-900">{booking.provider?.name}</p>
              <p className="text-slate-500">{booking.provider?.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="card p-5 mb-4">
        <h3 className="section-title">Timeline</h3>
        <div className="space-y-3">
          {booking.timeline?.map((e, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-brand-400 mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-800">{TIMELINE_LABELS[e.status] || e.status}</p>
                <p className="text-xs text-slate-500">{e.description}</p>
                <p className="text-xs text-slate-300 mt-0.5">{formatDateTime(e.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel */}
      {!['completed', 'cancelled', 'expired'].includes(booking.status) && (
        <button onClick={() => setShowCancelModal(true)}
          className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1.5">
          <XCircle size={15} /> Cancel booking
        </button>
      )}

      {/* Reject modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-box p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Reject Payment</h3>
            <label className="label">Reason for rejection *</label>
            <textarea className="input resize-none mb-4" rows={3}
              placeholder="Explain why the payment is being rejected…"
              value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={() => setShowRejectModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleRejectPayment} disabled={rejectingPayment || !rejectReason.trim()}
                className="btn-danger flex-1 justify-center">
                {rejectingPayment ? <Loader2 size={15} className="animate-spin" /> : 'Reject Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={showCancelModal}
        title="Cancel booking?"
        message="This will cancel the booking and notify all parties."
        onConfirm={handleCancel}
        onCancel={() => setShowCancelModal(false)}
        loading={cancelling}
        danger
      />
    </div>
  )
}
