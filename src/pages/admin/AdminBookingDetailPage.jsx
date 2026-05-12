import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { bookingsAPI, paymentsAPI, usersAPI } from '../../api'
import { formatDate, formatDateTime, formatCurrency, TIMELINE_LABELS } from '../../utils/helpers'
import toast from 'react-hot-toast'
import {
  ArrowLeft, CheckCircle, XCircle, UserCheck,
  ExternalLink, Loader2, MapPin, Calendar,
  Clock, ShieldAlert, FileText, Check, AlertTriangle
} from 'lucide-react'
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
    if (!booking.paymentId) return toast.error('No cryptographic proof payload mapped')
    setConfirmingPayment(true)
    try {
      await paymentsAPI.confirmPayment(booking.paymentId._id || booking.paymentId)
      toast.success('Escrow buffer lock released!')
      refetch()
    } catch { toast.error('Failed to handshake escrow settlement.') }
    finally { setConfirmingPayment(false) }
  }

  const handleRejectPayment = async () => {
    if (!rejectReason.trim()) return toast.error('Audit exception parameters mandatory')
    setRejectingPayment(true)
    try {
      await paymentsAPI.rejectPayment(booking.paymentId._id || booking.paymentId, rejectReason)
      toast.success('Escrow snapshot flagged as fraudulent.')
      setShowRejectModal(false)
      setRejectReason('')
      refetch()
    } catch { toast.error('Failed to trigger exception hook.') }
    finally { setRejectingPayment(false) }
  }

  const handleAssignProvider = async () => {
    if (!selectedProvider) return toast.error('Please map specific fleet technician coordinates')
    setAssigning(true)
    try {
      await bookingsAPI.assignProvider(id, selectedProvider)
      toast.success('Fleet technician dispatched!')
      refetch()
    } catch { toast.error('Failed to route provider dispatch.') }
    finally { setAssigning(false) }
  }

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await bookingsAPI.cancelBooking(id, 'Aborted by Master Executive node')
      toast.success('SLA permanently terminated.')
      setShowCancelModal(false)
      refetch()
    } catch { toast.error('Failed to override SLA state.') }
    finally { setCancelling(false) }
  }

  if (isLoading) return <InlineLoader />
  if (!booking) return (
    <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-100 max-w-2xl mx-auto mt-12">
      <AlertTriangle size={32} className="mx-auto mb-3 text-amber-500 animate-bounce" />
      <p className="text-sm font-bold text-slate-700">Cryptographic Node Unresolved</p>
      <p className="text-xs text-slate-400 mt-1">Requested document index could not be extracted from storage partitions.</p>
    </div>
  )

  const paymentObj = booking.paymentId

  return (
    <div className="animate-fade-in max-w-6xl space-y-6 pb-12">
      {/* Structural Back Hook */}
      <button onClick={() => navigate('/admin/bookings')} type="button"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-100 text-xs font-bold text-slate-500 hover:text-[#081225] hover:border-slate-200 transition-all shadow-sm">
        <ArrowLeft size={14} /> Back to Telemetry Ledgers
      </button>

      {/* Dynamic Upper Metadata Panel */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] font-bold">
              ID: {booking.bookingNumber || booking._id.slice(-6).toUpperCase()}
            </span>
            <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-wider">Master Command View</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-black text-[#081225] tracking-tight">{booking.serviceName}</h1>
          <p className="text-xs text-slate-400 mt-0.5">Origin creation hash logged on {formatDate(booking.createdAt || booking.scheduledDate)}</p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 pt-2 md:pt-0 border-t md:border-0 border-slate-50">
          <div className="text-right hidden sm:block">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">SLA Phase</span>
            <span className="text-xs font-bold text-slate-700">Live Handshake</span>
          </div>
          <StatusBadge status={booking.status} />
        </div>
      </div>

      {/* Principal Split Panel Navigation Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Heavy Escrow & Fleet Telemetry Execution (2 cols) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Payment Wire Verification Moderation Component */}
          {booking.status === 'payment_uploaded' && paymentObj && (
            <div className="bg-gradient-to-br from-amber-50/90 via-white to-amber-50/40 rounded-3xl p-6 border-2 border-amber-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 end-0 bg-amber-500 text-white px-3 py-1 rounded-bl-2xl text-[9px] font-black uppercase tracking-widest shadow-sm">
                Root Settlement Required
              </div>

              <div className="flex items-center gap-2 text-amber-800 font-black text-sm tracking-tight mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping flex-shrink-0" />
                <span>Uploaded Transaction Slip Auditing</span>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Patron generated cryptographic upload detected. Review wire proof validation keys below to transition order state into live technician assignment buffer.
              </p>

              <div className="bg-white rounded-2xl p-4 border border-amber-100/80 space-y-3 mb-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-400 font-bold">Payload Pointer:</span>
                  {paymentObj.proofFile ? (
                    <a href={paymentObj.proofFile.path} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-black text-[#10B981] hover:underline inline-flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                      <ExternalLink size={13} /> View Attached Slip Image
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">No storage URL key indexed</span>
                  )}
                </div>

                {paymentObj.transactionReference && (
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-50">
                    <span className="text-slate-400 font-bold">Bank TRN Reference:</span>
                    <code className="font-mono font-black text-[#081225] bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      {paymentObj.transactionReference}
                    </code>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-3">
                <button onClick={handleConfirmPayment} disabled={confirmingPayment} type="button"
                  className="flex-1 px-4 py-3 rounded-xl bg-[#10B981] hover:bg-[#0EA5E9] text-[#081225] hover:text-white font-black text-xs transition-all shadow-sm flex items-center justify-center gap-2">
                  {confirmingPayment ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} /> Release Lock (Approve)</>}
                </button>
                <button onClick={() => setShowRejectModal(true)} type="button"
                  className="px-4 py-3 rounded-xl bg-white hover:bg-red-50 text-red-500 border border-red-100 font-bold text-xs transition-all flex items-center justify-center gap-1.5">
                  <XCircle size={15} /> Flag Payload
                </button>
              </div>
            </div>
          )}

          {/* Capital Allocation & Liquidity Matrix */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Escrow Liquidity Settlement</h3>
              <span className="text-[10px] font-mono text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded font-bold">Guaranteed Clearing</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Total Quoted</span>
                <span className="text-lg font-black text-[#081225] font-mono block mt-0.5">{formatCurrency(booking.totalAmount)}</span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 border-b-2 border-b-[#C5A059]">
                <span className="text-[10px] text-[#C5A059] uppercase tracking-wider block font-bold">Platform Retained</span>
                <span className="text-lg font-black text-[#C5A059] font-mono block mt-0.5">{formatCurrency(booking.platformCommission || booking.totalAmount * 0.3)}</span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 border-b-2 border-b-[#10B981]">
                <span className="text-[10px] text-[#10B981] uppercase tracking-wider block font-bold">Fleet Disbursement</span>
                <span className="text-lg font-black text-[#10B981] font-mono block mt-0.5">{formatCurrency(booking.providerEarning || booking.totalAmount * 0.7)}</span>
              </div>
            </div>
          </div>

          {/* Unit Deployment Array (Assign Technician) */}
          {booking.status === 'payment_confirmed' && (
            <div className="bg-white rounded-3xl p-6 border border-[#10B981]/40 shadow-sm relative overflow-hidden space-y-4">
              <div className="absolute top-0 end-0 bg-[#10B981]/10 text-[#081225] font-mono text-[9px] font-black px-3 py-1 rounded-bl-2xl">
                Ready For Dispatch
              </div>

              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <UserCheck size={14} className="text-[#10B981]" /> Map Specialized Technician Node
              </h3>

              <p className="text-xs text-slate-500">
                Escrow funds verified. Allocate highly rated operational provider profiles active in target geography.
              </p>

              <div className="space-y-3">
                <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-[#081225] focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 transition-all"
                  value={selectedProvider} onChange={e => setSelectedProvider(e.target.value)}>
                  <option value="">Select target operational profile candidate…</option>
                  {providers?.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name} — Skills: {p.providerProfile?.skills?.join(', ') || 'General Asset'} · Rating: ({p.providerProfile?.averageRating || 5.0}★)
                    </option>
                  ))}
                </select>

                <button onClick={handleAssignProvider} disabled={assigning || !selectedProvider} type="button"
                  className="w-full py-3 rounded-xl bg-[#081225] hover:bg-[#C5A059] text-white hover:text-[#081225] font-black text-xs transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50">
                  {assigning ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Dispatch Coordinates'}
                </button>
              </div>
            </div>
          )}

          {/* Reassignment Node Buffer */}
          {booking.status === 'provider_assigned' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <UserCheck size={14} className="text-[#C5A059]" /> Hot-Swap Assigned Asset
              </h3>
              
              <div className="space-y-3">
                <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-[#081225] focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 transition-all"
                  value={selectedProvider} onChange={e => setSelectedProvider(e.target.value)}>
                  <option value="">Select fallback candidate node…</option>
                  {providers?.filter(p => p._id.toString() !== booking.provider?._id?.toString()).map(p => (
                    <option key={p._id} value={p._id}>{p.name} — Skills: {p.providerProfile?.skills?.join(', ')}</option>
                  ))}
                </select>

                <button onClick={handleAssignProvider} disabled={assigning || !selectedProvider} type="button"
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#081225] text-slate-700 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {assigning ? <Loader2 size={16} className="animate-spin" /> : 'Override Current Mapping'}
                </button>
              </div>
            </div>
          )}

          {/* Connected Logistics Cryptographic Timeline */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">SLA Lifecycle Ledger Audit</h3>
            
            <div className="space-y-4 pt-2 relative before:absolute before:start-1.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-100">
              {booking.timeline?.map((e, i) => (
                <div key={i} className="flex gap-3.5 text-xs relative group">
                  <div className="w-3 h-3 rounded-full bg-[#10B981] ring-4 ring-white mt-1 flex-shrink-0 z-10 transition-transform group-hover:scale-125" />
                  <div className="bg-slate-50 rounded-xl p-3 flex-1 border border-slate-100/50">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-slate-900">{TIMELINE_LABELS[e.status] || e.status}</span>
                      <span className="text-[10px] font-mono text-slate-400">{formatDateTime(e.timestamp)}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-1">{e.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Sticky Structural Telemetry & Absolute Node Authority (1 col) */}
        <div className="space-y-6 sticky top-24">

          {/* Execution Coordinates */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Geographic Dispatch Array</h3>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                <Calendar size={14} className="text-[#C5A059] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Scheduled Horizon</span>
                  <span className="font-bold text-slate-800">{formatDate(booking.scheduledDate)} @ {booking.scheduledTime}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                <MapPin size={14} className="text-[#10B981] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Patron Node Address</span>
                  <span className="font-medium text-slate-700 leading-tight block">{booking.address?.fullAddress || 'Unresolved Coordinate String'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Patron Telemetry */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-2 text-xs">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Patron Origin Hash</h3>
            <p className="font-black text-[#081225] text-sm tracking-tight">{booking.customer?.name || 'Encrypted Client'}</p>
            <p className="text-slate-500 font-mono text-[11px] truncate">{booking.customer?.email}</p>
            {booking.customer?.phone && (
              <p className="text-[#C5A059] font-mono text-[11px] font-bold pt-1">{booking.customer.phone}</p>
            )}
          </div>

          {/* Provider Node Mapping Preview */}
          {booking.provider && (
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-2 text-xs border-s-4 border-s-[#10B981]">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Allocated Provider Unit</h3>
              <p className="font-black text-slate-900 text-sm tracking-tight">{booking.provider?.name}</p>
              <p className="text-slate-500 font-mono text-[11px] truncate">{booking.provider?.email}</p>
              <span className="inline-block text-[9px] bg-emerald-50 text-[#10B981] font-bold px-2 py-0.5 rounded uppercase mt-1">SLA Synchronized</span>
            </div>
          )}

          {/* Absolute Root Override Actions */}
          {!['completed', 'cancelled', 'expired'].includes(booking.status) && (
            <div className="bg-red-50/50 rounded-3xl p-5 border border-red-100 text-center space-y-2">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">Absolute Exception Hook</span>
              <button onClick={() => setShowCancelModal(true)} type="button"
                className="w-full py-2.5 rounded-xl bg-white hover:bg-red-600 text-red-600 hover:text-white border border-red-200 font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5">
                <XCircle size={14} /> Abort Task Execution
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Exception Reason Capture Shell */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-md w-full border border-slate-100 shadow-glass animate-scale-in space-y-4">
            <h3 className="text-base font-black text-[#081225] tracking-tight">Audit Slip Flag Parameters</h3>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Exception Rationale *</label>
              <textarea className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-[#081225] focus:outline-none focus:ring-2 focus:ring-red-400/30 resize-none font-medium" rows={3}
                placeholder="Detail non-compliance keys preventing payment acknowledgment…"
                value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
            </div>
            <div className="flex gap-2.5 pt-2">
              <button onClick={() => setShowRejectModal(false)} type="button" className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">
                Cancel
              </button>
              <button onClick={handleRejectPayment} disabled={rejectingPayment || !rejectReason.trim()} type="button"
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50">
                {rejectingPayment ? <Loader2 size={15} className="animate-spin" /> : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Hooks */}
      <ConfirmModal
        open={showCancelModal}
        title="Execute Permanent Abort?"
        message="This will instantly zero out the escrow authorization pipeline and emit webhooks to connected client/provider mobile devices."
        onConfirm={handleCancel}
        onCancel={() => setShowCancelModal(false)}
        loading={cancelling}
        danger
      />
    </div>
  )
}
