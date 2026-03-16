import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { bookingsAPI, paymentsAPI, reviewsAPI } from '../../api'
import { formatDate, formatDateTime, formatCurrency, TIMELINE_LABELS } from '../../utils/helpers'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Upload, X, CheckCircle, Clock, MapPin,
  User, Star, FileText, Loader2, XCircle, Calendar
} from 'lucide-react'
import { InlineLoader, StatusBadge, ConfirmModal, StarRating } from '../../components/common/LoadingSpinner'

export default function BookingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [uploading, setUploading] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [proofFile, setProofFile] = useState(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const fileRef = useRef()

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingsAPI.getBooking(id),
    select: d => d.data.data.booking
  })

  const refetch = () => qc.invalidateQueries(['booking', id])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5MB')
      return
    }
    setProofFile(file)
  }

  const handleUploadProof = async () => {
    if (!proofFile) return toast.error('Please select a file')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('proofFile', proofFile)
      await paymentsAPI.uploadProof(booking._id, formData)
      toast.success('Payment proof uploaded!')
      setProofFile(null)
      refetch()
    } catch {
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await bookingsAPI.cancelBooking(id, 'Cancelled by customer')
      toast.success('Booking cancelled.')
      setShowCancelModal(false)
      refetch()
    } catch {
      toast.error('Failed to cancel booking.')
    } finally {
      setCancelling(false)
    }
  }

  const handleReview = async () => {
    setSubmittingReview(true)
    try {
      await reviewsAPI.createReview({ bookingId: id, rating, comment })
      toast.success('Review submitted!')
      setShowReviewForm(false)
      refetch()
    } catch {
      toast.error('Failed to submit review.')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (isLoading) return <InlineLoader />
  if (!booking) return <div className="text-center py-20 text-slate-400">Booking not found.</div>

  const canUploadPayment = ['pending_payment', 'payment_uploaded'].includes(booking.status)
  const canCancel = !['completed', 'cancelled', 'expired', 'in_progress'].includes(booking.status)
  const canReview = booking.status === 'completed' && !booking.reviewId

  return (
    <div className="animate-fade-in max-w-2xl">
      <button onClick={() => navigate('/bookings')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft size={16} /> Back to bookings
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{booking.serviceName}</h1>
          <p className="text-sm text-slate-400 mt-1">#{booking.bookingNumber}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Details card */}
      <div className="card p-5 mb-4 space-y-3">
        <DetailRow icon={Calendar} label="Date & Time"
          value={`${formatDate(booking.scheduledDate)} at ${booking.scheduledTime}`} />
        <DetailRow icon={MapPin} label="Address"
          value={`${booking.address.fullAddress}, ${booking.address.city}`} />
        {booking.provider && (
          <DetailRow icon={User} label="Provider" value={booking.provider.name} />
        )}
        <div className="divider !my-1" />
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Total amount</span>
          <span className="font-bold text-slate-900">{formatCurrency(booking.totalAmount)}</span>
        </div>
      </div>

      {/* Payment upload */}
      {canUploadPayment && (
        <div className="card p-5 mb-4 border-amber-200 bg-amber-50">
          <h3 className="font-semibold text-amber-900 mb-1 flex items-center gap-2">
            <FileText size={16} /> Upload Payment Proof
          </h3>
          <p className="text-xs text-amber-700 mb-4">
            Transfer <strong>{formatCurrency(booking.totalAmount)}</strong> to our bank account, then upload proof below.
          </p>

          <div className="bg-white rounded-xl p-3 mb-4 text-xs text-slate-600 space-y-1 border border-amber-100">
            <p><strong>Bank:</strong> Al Rajhi Bank</p>
            <p><strong>Account:</strong> 1234-5678-9012-3456</p>
            <p><strong>IBAN:</strong> SA44 2000 0001 2345 6789 1234</p>
            <p><strong>Reference:</strong> {booking.bookingNumber}</p>
          </div>

          <input ref={fileRef} type="file" accept="image/*,.pdf"
            className="hidden" onChange={handleFileSelect} />

          {proofFile ? (
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-amber-100 mb-3">
              <CheckCircle size={16} className="text-emerald-500" />
              <span className="text-sm text-slate-700 flex-1 truncate">{proofFile.name}</span>
              <button onClick={() => setProofFile(null)} className="text-slate-400 hover:text-red-500">
                <X size={16} />
              </button>
            </div>
          ) : (
            <button onClick={() => fileRef.current.click()}
              className="w-full border-2 border-dashed border-amber-200 rounded-xl p-4 text-sm text-amber-700 hover:bg-amber-100/50 transition-colors flex items-center justify-center gap-2 mb-3">
              <Upload size={16} /> Click to select file (JPG, PNG, PDF · max 5MB)
            </button>
          )}

          {booking.status === 'payment_uploaded' && !proofFile && (
            <div className="flex items-center gap-2 text-sm text-blue-600 mb-3">
              <Clock size={14} /> Proof uploaded — awaiting admin review
            </div>
          )}

          {proofFile && (
            <button onClick={handleUploadProof} disabled={uploading} className="btn-primary w-full justify-center">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : 'Submit Payment Proof'}
            </button>
          )}
        </div>
      )}

      {/* Payment confirmed indicator */}
      {booking.status === 'payment_confirmed' && (
        <div className="card p-4 mb-4 bg-emerald-50 border-emerald-200 flex items-center gap-3">
          <CheckCircle size={18} className="text-emerald-500" />
          <p className="text-sm text-emerald-700 font-medium">Payment confirmed — a provider will be assigned shortly.</p>
        </div>
      )}

      {/* Review form */}
      {canReview && (
        <div className="card p-5 mb-4">
          {!showReviewForm ? (
            <button onClick={() => setShowReviewForm(true)} className="w-full flex items-center gap-3 text-left group">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Star size={18} className="text-amber-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Rate your experience</p>
                <p className="text-xs text-slate-400">Share your feedback about this service</p>
              </div>
              <span className="ml-auto text-xs text-brand-600 font-medium group-hover:underline">Write review</span>
            </button>
          ) : (
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Rate this service</h3>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <button key={i} onClick={() => setRating(i)}
                    className={`w-10 h-10 rounded-xl border transition-all ${i <= rating ? 'bg-amber-400 border-amber-400 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                    ★
                  </button>
                ))}
              </div>
              <textarea className="input resize-none mb-3" rows={3}
                placeholder="Share your experience…"
                value={comment} onChange={e => setComment(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={() => setShowReviewForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleReview} disabled={submittingReview} className="btn-primary flex-1 justify-center">
                  {submittingReview ? <Loader2 size={16} className="animate-spin" /> : 'Submit Review'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Timeline */}
      <div className="card p-5 mb-4">
        <h3 className="section-title">Booking Timeline</h3>
        <div className="space-y-4">
          {booking.timeline?.map((event, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0
                  ${i === 0 ? 'bg-brand-600' : 'bg-slate-300'}`} />
                {i < booking.timeline.length - 1 && (
                  <div className="w-px flex-1 bg-slate-100 mt-1 min-h-[20px]" />
                )}
              </div>
              <div className="pb-3 flex-1">
                <p className="text-sm font-medium text-slate-800">
                  {TIMELINE_LABELS[event.status] || event.status}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{event.description}</p>
                <p className="text-xs text-slate-300 mt-1">{formatDateTime(event.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel button */}
      {canCancel && (
        <button onClick={() => setShowCancelModal(true)}
          className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-600 py-3">
          <XCircle size={16} /> Cancel this booking
        </button>
      )}

      <ConfirmModal
        open={showCancelModal}
        title="Cancel booking?"
        message="This action cannot be undone. Your booking will be cancelled."
        onConfirm={handleCancel}
        onCancel={() => setShowCancelModal(false)}
        loading={cancelling}
        danger
      />
    </div>
  )
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <Icon size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="text-slate-500">{label}: </span>
        <span className="text-slate-800 font-medium">{value}</span>
      </div>
    </div>
  )
}
