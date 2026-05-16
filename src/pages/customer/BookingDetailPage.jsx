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
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate('/bookings')} type="button"
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Return to Order Matrices
        </button>
        
        <button onClick={refetch} type="button" className="text-[10px] text-slate-400 hover:text-brand-500 flex items-center gap-1">
          <RefreshCw size={12} className="animate-spin-slow" /> Force State Sync
        </button>
      </div>

      {/* Main Core Viewport Layout */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Details & Timeline Panels */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Header Metadata container */}
          <div className="glass-card !p-8 relative overflow-hidden">
            <div className="absolute top-0 end-0 glass border-b border-s border-white/5 px-4 py-1.5 rounded-bl-2xl text-[9px] font-mono text-slate-400">
              NODE ID: {booking._id.slice(-6).toUpperCase()}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold text-brand-500 tracking-[0.2em] uppercase block mb-3">
                  Service Dispatch Descriptor
                </span>
                <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none">
                  {booking.serviceName}
                </h1>
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Ref: #{booking.bookingNumber}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-slate-700" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SLA v1.4</span>
                </div>
              </div>

              <div className="self-start sm:self-auto text-right">
                <StatusBadge status={booking.status} />
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <DetailBox icon={Calendar} label="Target Date" value={`${formatDate(booking.scheduledDate)} @ ${booking.scheduledTime}`} />
              <DetailBox icon={MapPin} label="Geofence Anchor" value={`${booking.address?.city || 'Riyadh'}, ${booking.address?.district || 'Sector A'}`} />
            </div>

            {booking.provider && (
              <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between bg-white/[0.02] rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-[#0B1120] font-bold text-sm shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                    {booking.provider.name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{booking.provider.name}</p>
                    <p className="text-[10px] font-bold text-brand-400 uppercase tracking-tight mt-0.5">Verified Technician Cluster</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-brand-400">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Secure Link</span>
                </div>
              </div>
            )}
          </div>

          {/* Connected Logistics-Style Tracking Timeline */}
          <div className="glass-card !p-8">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
              <Layers className="w-5 h-5 text-brand-500" />
              <h3 className="font-extrabold text-white text-lg tracking-tight">Logistics Audit Trail</h3>
            </div>

            <div className="relative ps-4">
              <div className="absolute start-[15px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-brand-500 via-brand-500/20 to-transparent" />

              <div className="space-y-8 relative z-10">
                {timelineEvents.map((ev, idx) => {
                  const isLatest = idx === timelineEvents.length - 1
                  return (
                    <div key={idx} className="flex gap-6 items-start group">
                      <div className={`w-4 h-4 rounded-full mt-1.5 flex items-center justify-center transition-all ${
                        isLatest
                          ? 'bg-brand-500 shadow-[0_0_15px_rgba(34,197,94,0.5)] scale-125'
                          : 'bg-slate-800'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isLatest ? 'bg-white' : 'bg-slate-600'}`} />
                      </div>

                      <div className="flex-1 glass p-5 rounded-2xl group-hover:bg-white/[0.05] transition-colors">
                        <div className="flex items-center justify-between gap-4 mb-1.5">
                          <span className={`text-xs font-bold uppercase tracking-widest ${isLatest ? 'text-brand-400' : 'text-white'}`}>
                            {TIMELINE_LABELS[ev.status] || ev.status.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 font-bold">
                            {formatDateTime(ev.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">
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
            <div className="text-center pt-4">
              <button onClick={() => setShowCancelModal(true)} type="button"
                className="inline-flex items-center gap-2 text-xs font-bold text-red-500/60 hover:text-red-400 hover:bg-red-500/10 px-6 py-3 rounded-2xl transition-all">
                <XCircle size={14} /> Initiate SLA Abort Protocol
              </button>
            </div>
          )}

        </div>

        {/* Right Side Payment Verification Dashboard & Cost Blocks */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Total Cost Quoted Display */}
          <div className="glass-card !p-8 relative overflow-hidden border-brand-500/10">
            <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-brand-500/10 rounded-full blur-[80px] pointer-events-none" />

            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 block mb-3">
              Final Escrow Value
            </span>
            <div className="flex items-baseline justify-between mb-6">
              <span className="text-4xl font-extrabold text-white font-mono tracking-tighter">
                {formatCurrency(booking.totalAmount)}
              </span>
              <span className="text-[10px] text-brand-500 font-black tracking-widest uppercase px-2 py-1 bg-brand-500/10 rounded-lg">
                Protected
              </span>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">Base Unit Price</span>
                <span className="text-white">{formatCurrency(booking.totalAmount || 0)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-slate-500">Service Fee</span>
                <span className="text-brand-500">SAR 0.00 (Promo)</span>
              </div>
            </div>
          </div>

          {/* Core Wire Transfer Upload Container */}
          {canUploadPayment && (
            <div className="glass-card !p-8 border-2 border-brand-500/30 relative">
              <div className="absolute -top-3 left-8 bg-brand-500 text-[#0B1120] text-[10px] font-black tracking-[0.1em] uppercase px-4 py-1 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                Action Required
              </div>

              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500">
                  <FileText size={20} />
                </div>
                <h3 className="text-lg font-extrabold text-white tracking-tight">Wire Handshake</h3>
              </div>
              
              <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8">
                Transmit your payment snapshot to our vault to unlock technical dispatch.
              </p>

              {/* High fidelity static account display block */}
              <div className="glass rounded-2xl p-6 border border-white/5 space-y-4 text-xs mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Bank</span>
                  <span className="font-extrabold text-white">Al Rajhi Central Hub</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Account</span>
                  <span className="font-mono text-white text-sm">1234-5678-9012-3456</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">IBAN</span>
                  <span className="font-mono text-white text-[11px]">SA44 2000 0001 2345 6789</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-brand-500 font-black text-[10px] uppercase tracking-[0.2em]">Mandatory Ref</span>
                  <span className="bg-brand-500/20 text-brand-400 font-black px-2 py-1 rounded-lg border border-brand-500/30">
                    {booking.bookingNumber}
                  </span>
                </div>
              </div>

              <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileSelect} />

              {proofFile ? (
                <div className="glass rounded-2xl p-4 border border-brand-500/30 flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3 min-w-0">
                    <CheckCircle size={18} className="text-brand-500" />
                    <span className="text-xs font-bold text-white truncate">{proofFile.name}</span>
                  </div>
                  <button onClick={() => setProofFile(null)} type="button" className="text-slate-500 hover:text-red-400 transition-colors">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <button onClick={() => fileRef.current.click()} type="button"
                  className="w-full border-2 border-dashed border-white/10 hover:border-brand-500/50 hover:bg-brand-500/5 rounded-[2rem] p-8 text-center transition-all group mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={20} className="text-slate-500 group-hover:text-brand-500" />
                  </div>
                  <span className="text-sm font-bold text-white block mb-1">Transmit Payload</span>
                  <span className="text-[10px] text-slate-500 font-medium block">JPG, PNG, PDF (Max 5MB)</span>
                </button>
              )}

              {booking.status === 'payment_uploaded' && !proofFile && (
                <div className="bg-brand-500/10 border border-brand-500/20 rounded-2xl p-4 text-xs font-bold flex items-center gap-3 mb-6">
                  <Clock size={16} className="text-brand-500 animate-spin-slow" />
                  <span className="text-brand-400">Snapshot locked in audit buffer. Waiting for clearance.</span>
                </div>
              )}

              {proofFile && (
                <button onClick={handleUploadProof} disabled={uploading} type="button"
                  className="btn-primary w-full justify-center py-4 text-xs tracking-widest uppercase font-black">
                  {uploading ? <Loader2 size={20} className="animate-spin" /> : 'Force Synchronization'}
                </button>
              )}
            </div>
          )}

          {/* Payment confirmed state container block */}
          {booking.status === 'payment_confirmed' && (
            <div className="glass-card !p-8 border-brand-500/20 bg-brand-500/[0.03] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center flex-shrink-0 text-brand-500">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-1">Handshake Confirmed</p>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Escrow locked successfully. Logistics cluster has matched your technical team vectors.
                </p>
              </div>
            </div>
          )}

          {/* Review Builder Container Block */}
          {canReview && (
            <div className="glass-card !p-8">
              {!showReviewForm ? (
                <button onClick={() => setShowReviewForm(true)} type="button" className="w-full text-start group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center transition-all group-hover:bg-brand-500/20">
                      <Star size={20} className="text-slate-400 group-hover:text-brand-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-extrabold text-white">Rate Logistics</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-0.5">Improve regional routing</p>
                    </div>
                    <ArrowLeft className="w-5 h-5 text-brand-500 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Select Quality Tier</h3>
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <button key={i} onClick={() => setRating(i)} type="button"
                        className={`w-full h-12 rounded-2xl border text-sm transition-all font-black ${
                          i <= rating ? 'bg-brand-500 border-brand-500 text-[#0B1120]' : 'glass border-white/10 text-slate-500'
                        }`}>
                        {i}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Detailed Telemetry</label>
                    <textarea className="input-glass resize-none min-h-[100px]"
                      placeholder="Physical arrival accuracy, cleanliness, equipment audit..."
                      value={comment} onChange={e => setComment(e.target.value)} />
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button onClick={() => setShowReviewForm(false)} type="button" className="flex-1 px-4 py-3 rounded-2xl border border-white/10 text-xs font-bold text-slate-400 hover:bg-white/5 transition-colors">
                      Abort
                    </button>
                    <button onClick={handleReview} disabled={submittingReview} type="button"
                      className="btn-primary flex-[2] justify-center py-3 font-black">
                      {submittingReview ? <Loader2 size={16} className="animate-spin" /> : 'Log Performance'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      <ConfirmModal
        open={showCancelModal}
        title="Authorize Order Abortion"
        message="Purging this dispatch index halts all automated matching modules. SLA deposits may be subject to structural deductions."
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
    <div className="glass p-4 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-brand-500 opacity-80" />
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">{label}</span>
      </div>
      <p className="text-xs font-bold text-white line-clamp-1">{value}</p>
    </div>
  )
}
