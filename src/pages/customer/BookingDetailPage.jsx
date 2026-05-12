import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { bookingsAPI, paymentsAPI, reviewsAPI } from '../../api'
import { formatDate, formatDateTime, formatCurrency, TIMELINE_LABELS } from '../../utils/helpers'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Upload, X, CheckCircle, Clock, MapPin,
  User, Star, FileText, Loader2, XCircle, Calendar,
  ShieldCheck, AlertCircle, RefreshCw, Layers
} from 'lucide-react'
import { InlineLoader, StatusBadge, ConfirmModal } from '../../components/common/LoadingSpinner'

export default function BookingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [uploading, setUploading] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [proofFile, setProofFile] = useState(null)
  
  // Custom interactive review builder state
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error('Attached payload exceeded maximum allowable bound (5MB)')
      return
    }
    setProofFile(file)
  }

  const handleUploadProof = async () => {
    if (!proofFile) return toast.error('Select valid receipt snapshot to transmit.')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('proofFile', proofFile)
      await paymentsAPI.uploadProof(booking._id, formData)
      toast.success('Payment snapshot encrypted & transmitted! Moderation alert dispatched.')
      setProofFile(null)
      refetch()
    } catch {
      toast.error('Encryption transmission failed. Please retry cluster connection.')
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await bookingsAPI.cancelBooking(id, 'Patron initiated final abort sequence')
      toast.success('Service payload assignment cancelled.')
      setShowCancelModal(false)
      refetch()
    } catch {
      toast.error('SLA interruption failed.')
    } finally {
      setCancelling(false)
    }
  }

  const handleReview = async () => {
    setSubmittingReview(true)
    try {
      await reviewsAPI.createReview({ bookingId: id, rating, comment })
      toast.success('Quality metrics recorded into global blockchain ledger!')
      setShowReviewForm(false)
      refetch()
    } catch {
      toast.error('Telemetry update failed.')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (isLoading) return <InlineLoader />
  if (!booking) return <div className="text-center py-20 text-slate-400">Target payload index broken or purged.</div>

  const canUploadPayment = ['pending_payment', 'payment_uploaded'].includes(booking.status)
  const canCancel = !['completed', 'cancelled', 'expired', 'in_progress'].includes(booking.status)
  const canReview = booking.status === 'completed' && !booking.reviewId

  // Determine current timeline active steps visually
  const timelineEvents = booking.timeline || [
    { status: 'created', description: 'Order initialized', timestamp: booking.createdAt || new Date() }
  ]

  return (
    <div className="animate-fade-in pb-12">
      {/* Return Action */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/bookings')} type="button"
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#081225] transition-colors">
          <ArrowLeft size={16} /> Return to Order Matrices
        </button>
        
        <button onClick={refetch} type="button" className="text-[10px] text-slate-400 hover:text-[#C5A059] flex items-center gap-1">
          <RefreshCw size={12} className="animate-spin-slow" /> Force State Sync
        </button>
      </div>

      {/* Main Core Viewport Layout */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Details & Timeline Panels */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header Metadata container */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 end-0 bg-slate-50 border-b border-s border-slate-100 px-3 py-1 rounded-bl-xl text-[9px] font-mono text-slate-400">
              ID: {booking._id.slice(-6).toUpperCase()}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-[#C5A059] tracking-widest uppercase block mb-1">
                  Active Dispatch Descriptor
                </span>
                <h1 className="text-2xl font-black text-[#081225] tracking-tight leading-none">
                  {booking.serviceName}
                </h1>
                <p className="text-xs font-mono font-bold text-slate-400 mt-1.5">
                  Reference: #{booking.bookingNumber}
                </p>
              </div>

              {/* Enhanced Live Status Indicator */}
              <div className="self-start sm:self-auto">
                <StatusBadge status={booking.status} />
                <span className="text-[9px] text-slate-400 block text-end mt-1 font-bold">Encrypted SLA</span>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-4">
              <DetailBox icon={Calendar} label="Target Scheduled Date" value={`${formatDate(booking.scheduledDate)} @ ${booking.scheduledTime}`} />
              <DetailBox icon={MapPin} label="Geofence Anchor" value={`${booking.address?.city || 'Riyadh'}, ${booking.address?.district || 'Sector A'}`} />
            </div>

            {booking.provider && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/60 rounded-xl p-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#081225] flex items-center justify-center text-[#C5A059] font-bold text-xs">
                    {booking.provider.name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{booking.provider.name}</p>
                    <p className="text-[10px] text-[#10B981]">Assigned Technician Cluster</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-white px-2 py-1 rounded border border-slate-100">
                  Verified Shield
                </span>
              </div>
            )}
          </div>

          {/* Connected Logistics-Style Tracking Timeline */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100">
              <Layers className="w-5 h-5 text-[#081225]" />
              <h3 className="font-extrabold text-[#081225] text-base tracking-tight">Logistics Timeline Audit</h3>
            </div>

            <div className="relative ps-3">
              {/* Vertical guideline bar */}
              <div className="absolute start-[15px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#10B981] via-[#C5A059]/40 to-slate-200" />

              <div className="space-y-6 relative z-10">
                {timelineEvents.map((ev, idx) => {
                  const isLatest = idx === timelineEvents.length - 1
                  return (
                    <div key={idx} className="flex gap-4 items-start group">
                      <div className={`w-3.5 h-3.5 rounded-full mt-1.5 flex items-center justify-center transition-transform ${
                        isLatest
                          ? 'bg-[#10B981] text-white ring-4 ring-[#10B981]/20 scale-125'
                          : 'bg-[#081225] text-[#C5A059]'
                      }`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>

                      <div className="flex-1 bg-surface-50 rounded-xl p-3.5 border border-slate-100 group-hover:border-slate-200 transition-colors">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-900 capitalize tracking-wide">
                            {TIMELINE_LABELS[ev.status] || ev.status.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {formatDateTime(ev.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          {ev.description || 'System cluster updated task array configuration.'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Cancel Module */}
          {canCancel && (
            <div className="text-center">
              <button onClick={() => setShowCancelModal(true)} type="button"
                className="inline-flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50/50 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors">
                <XCircle size={14} /> Initiate Order Abort Protocol
              </button>
            </div>
          )}

        </div>

        {/* Right Side Payment Verification Dashboard & Cost Blocks */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Total Cost Quoted Display */}
          <div className="bg-[#081225] rounded-3xl p-6 text-white border border-white/10 shadow-glass relative overflow-hidden">
            <div className="absolute top-0 end-0 w-32 h-32 bg-[#10B981]/10 rounded-full blur-2xl pointer-events-none" />

            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block mb-1">
              Final Escrow Hold
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#C5A059] font-mono tracking-tight">
                {formatCurrency(booking.totalAmount)}
              </span>
              <span className="text-[10px] text-[#10B981] font-bold">SLA Protected</span>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Base Line Parameter</span>
                <span>{formatCurrency(booking.totalAmount || 0)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Network Routing Overhead</span>
                <span className="text-slate-500">Waived</span>
              </div>
            </div>
          </div>

          {/* Core Wire Transfer Upload Container */}
          {canUploadPayment && (
            <div className="bg-white rounded-3xl p-6 border-2 border-[#C5A059]/40 shadow-glass relative">
              <div className="absolute -top-3 end-6 bg-[#C5A059] text-[#081225] text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                Action Required
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                <FileText size={16} className="text-[#C5A059]" /> Bank Transfer Handshake
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Execute wire transfer directly to our automated vault using the routing indices below to unlock technical dispatch.
              </p>

              {/* High fidelity static account display block */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs text-slate-700 font-mono mb-4">
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-400 text-[10px]">VAULT BANK</span>
                  <span className="font-bold text-slate-900">Al Rajhi Central Hub</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-400 text-[10px]">ACCOUNT</span>
                  <span className="font-bold">1234-5678-9012-3456</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-400 text-[10px]">IBAN LAYER</span>
                  <span className="text-[11px] font-bold text-[#081225]">SA44 2000 0001 2345 6789 1234</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-[#C5A059] text-[10px] font-bold">REQUIRED REF</span>
                  <span className="bg-[#C5A059]/10 text-[#081225] font-black px-1.5 py-0.5 rounded">
                    {booking.bookingNumber}
                  </span>
                </div>
              </div>

              {/* Custom input triggering helper element */}
              <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileSelect} />

              {proofFile ? (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle size={16} className="text-[#10B981] flex-shrink-0" />
                    <span className="text-xs font-bold text-slate-800 truncate">{proofFile.name}</span>
                  </div>
                  <button onClick={() => setProofFile(null)} type="button" className="text-slate-400 hover:text-red-500 p-1">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button onClick={() => fileRef.current.click()} type="button"
                  className="w-full border-2 border-dashed border-slate-200 hover:border-[#C5A059] rounded-2xl p-4 text-center transition-all group mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-[#C5A059]/10 flex items-center justify-center mx-auto mb-2 transition-colors">
                    <Upload size={16} className="text-slate-500 group-hover:text-[#C5A059] transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 block">Select receipt payload</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Accepts encrypted JPG/PNG/PDF (Max 5MB)</span>
                </button>
              )}

              {booking.status === 'payment_uploaded' && !proofFile && (
                <div className="bg-blue-50 text-blue-800 rounded-xl p-3 text-xs font-bold flex items-center gap-2 mb-4 border border-blue-100">
                  <Clock size={14} className="animate-spin-slow flex-shrink-0" />
                  <span>Payload locked in validation buffer. Admin authorization active.</span>
                </div>
              )}

              {proofFile && (
                <button onClick={handleUploadProof} disabled={uploading} type="button"
                  className="btn-gold w-full justify-center py-3 text-xs tracking-widest uppercase font-black text-[#081225]">
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : 'Transmit Cryptographic Payload'}
                </button>
              )}
            </div>
          )}

          {/* Payment confirmed state container block */}
          {booking.status === 'payment_confirmed' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex items-start gap-3">
              <ShieldCheck size={20} className="text-[#10B981] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-900">Handshake Confirmed</p>
                <p className="text-[11px] text-emerald-700 leading-relaxed mt-0.5">
                  Escrow locked successfully. Routing cluster matches technician team vectors instantly.
                </p>
              </div>
            </div>
          )}

          {/* Review Builder Container Block */}
          {canReview && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              {!showReviewForm ? (
                <button onClick={() => setShowReviewForm(true)} type="button" className="w-full text-start group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 group-hover:bg-[#C5A059]/10 flex items-center justify-center flex-shrink-0 transition-colors">
                      <Star size={18} className="text-amber-500 group-hover:text-[#C5A059] transition-colors" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-[#081225]">Rate Service Execution</p>
                      <p className="text-[10px] text-slate-400">Provide direct telemetry to improve Gulf SLA routing</p>
                    </div>
                    <span className="text-xs font-bold text-[#C5A059] group-hover:underline">Launch</span>
                  </div>
                </button>
              ) : (
                <div className="space-y-4 animate-scale-in">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Select Tier Stars</h3>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <button key={i} onClick={() => setRating(i)} type="button"
                        className={`w-10 h-10 rounded-xl border text-base transition-all ${
                          i <= rating ? 'bg-[#C5A059] border-[#C5A059] text-[#081225] font-black' : 'bg-slate-50 border-slate-200 text-slate-300'
                        }`}>
                        ★
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="label text-[10px]">Operational Telemetry String</label>
                    <textarea className="input resize-none py-2 text-xs" rows={3}
                      placeholder="Detail physical arrival accuracy and workspace cleanliness..."
                      value={comment} onChange={e => setComment(e.target.value)} />
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setShowReviewForm(false)} type="button" className="btn-secondary btn-sm flex-1 font-bold">
                      Abort
                    </button>
                    <button onClick={handleReview} disabled={submittingReview} type="button"
                      className="btn-primary btn-sm flex-1 justify-center bg-[#081225] font-bold">
                      {submittingReview ? <Loader2 size={14} className="animate-spin" /> : 'Log Payload'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Confirmation modal wrapper */}
      <ConfirmModal
        open={showCancelModal}
        title="Authorize Action Authorization"
        message="Purging this order halts automated matching indices. SLA deposits may be subject to minor structural settlement deductions."
        onConfirm={handleCancel}
        onCancel={() => setShowCancelModal(false)}
        loading={cancelling}
        danger
      />
    </div>
  )
}

function DetailBox({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100">
      <div className="flex items-center gap-1.5 mb-1 text-slate-400">
        <Icon size={12} />
        <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-xs font-bold text-slate-800 line-clamp-1">{value}</p>
    </div>
  )
}
