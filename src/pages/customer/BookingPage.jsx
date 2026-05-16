import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { servicesAPI, bookingsAPI, usersAPI } from '../../api'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Clock, MapPin, Calendar, ChevronRight,
  Loader2, Sparkles, CheckCircle2, ShieldCheck, HelpCircle, Map
} from 'lucide-react'
import { InlineLoader } from '../../components/common/LoadingSpinner'

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00',
]

// Get next 14 available days (no Fridays in KSA)
const getAvailableDates = () => {
  const dates = []
  const d = new Date()
  d.setDate(d.getDate() + 1)
  while (dates.length < 14) {
    if (d.getDay() !== 5) { // Skip Friday
      dates.push(new Date(d))
    }
    d.setDate(d.getDate() + 1)
  }
  return dates
}

export default function BookingPage() {
  const { serviceId } = useParams()
  const navigate = useNavigate()

  const [step, setStep] = useState(1) // 1=datetime, 2=address, 3=review
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [addressMode, setAddressMode] = useState('saved') // 'saved' | 'new'
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [newAddress, setNewAddress] = useState({ fullAddress: '', city: 'Riyadh', district: '', landmark: '' })
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  // Simulated live priority multiplier
  const [urgencyTier, setUrgencyTier] = useState('standard') // 'standard' | 'express'

  const { data: service, isLoading: serviceLoading } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => servicesAPI.getService(serviceId),
    select: d => d.data.data.service
  })

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => usersAPI.getProfile(),
    select: d => d.data.data.user
  })

  const availableDates = getAvailableDates()
  const savedAddresses = profile?.addresses || []

  // Auto-switch to new mapping if no profiles exist
  useEffect(() => {
    if (profile && savedAddresses.length === 0) {
      setAddressMode('new')
    }
  }, [profile, savedAddresses.length])

  const canProceedStep1 = selectedDate && selectedTime
  const canProceedStep2 = (addressMode === 'saved' && savedAddresses.length > 0)
    ? !!selectedAddressId
    : !!newAddress.fullAddress && !!newAddress.city

  const basePrice = service?.price || 0
  const expressFee = urgencyTier === 'express' ? 50 : 0
  const finalTotal = basePrice + expressFee

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        serviceId,
        scheduledDate: selectedDate.toISOString(),
        scheduledTime: selectedTime,
        notes: urgencyTier === 'express' ? `[EXPRESS DISPATCH] ${notes}` : notes,
        ...(addressMode === 'saved' ? { addressId: selectedAddressId } : { customAddress: newAddress })
      }
      const { data } = await bookingsAPI.createBooking(payload)
      toast.success('Booking initialized securely! Upload payment proof to lock dispatch.')
      navigate(`/bookings/${data.data.booking._id}`)
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking setup aborted.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (serviceLoading) return <InlineLoader />
  if (!service) return <div className="text-center py-20 text-slate-400">Target service descriptor missing from catalog repository.</div>

  return (
    <div className="animate-fade-in pb-12">
      {/* Top control stripe */}
      <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)}
        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> {step > 1 ? 'Return to Previous Parameter' : 'Back to Service Profile'}
      </button>

      {/* Main Grid splitting content & sticky live summary block */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form Block */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Enhanced Wizard Indicator Header */}
          <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/5 shadow-2xl flex items-center justify-between">
            {[
              { num: 1, label: 'Schedule', desc: 'Date & Slot' },
              { num: 2, label: 'Coordinates', desc: 'Address Layer' },
              { num: 3, label: 'Lock Order', desc: 'Final Verification' },
            ].map((st, i) => {
              const isDone = step > st.num
              const isCurr = step === st.num
              return (
                <div key={st.num} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-extrabold text-xs transition-all ${
                    isDone ? 'bg-[#10B981] text-white shadow-2xl' :
                    isCurr ? 'bg-[#0B1120] text-[#22C55E] shadow-md scale-105' :
                    'bg-white/5 text-slate-400'
                  }`}>
                    {isDone ? <CheckCircle2 size={16} /> : st.num}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`text-xs font-bold leading-tight ${isCurr ? 'text-white' : 'text-slate-400'}`}>
                      {st.label}
                    </p>
                    <p className="text-[10px] text-slate-400">{st.desc}</p>
                  </div>
                  {i < 2 && <div className="w-4 sm:w-8 h-px bg-white/5 mx-1 sm:mx-2" />}
                </div>
              )
            })}
          </div>

          {/* Step 1 — Date & Time Selection */}
          {step === 1 && (
            <div className="card p-6 space-y-6 animate-slide-up">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <Calendar size={16} className="text-[#22C55E]" /> Select Active Date
                  </h2>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">No Friday Slots (KSA)</span>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {availableDates.map((date, i) => {
                    const isSelected = selectedDate?.toDateString() === date.toDateString()
                    return (
                      <button key={i} onClick={() => setSelectedDate(date)} type="button"
                        className={`p-2.5 rounded-2xl text-center transition-all border ${
                          isSelected ? 'bg-[#0B1120] text-white border-[#0B1120] shadow-2xl scale-105' :
                          'bg-white/5 border-white/5 hover:border-[#22C55E]/40 text-slate-300'
                        }`}>
                        <div className="text-[10px] opacity-70 font-bold">{date.toLocaleDateString('en', { weekday: 'short' })}</div>
                        <div className="text-base font-extrabold mt-0.5 tracking-tight">{date.getDate()}</div>
                        <div className="text-[9px] opacity-70 uppercase tracking-tight">{date.toLocaleDateString('en', { month: 'short' })}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <h2 className="text-sm font-bold text-white uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-[#22C55E]" /> Optimized Dispatch Time
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.map(t => {
                    const isSelected = selectedTime === t
                    return (
                      <button key={t} onClick={() => setSelectedTime(t)} type="button"
                        className={`py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                          isSelected ? 'bg-[#22C55E] text-white border-[#22C55E] shadow-2xl font-extrabold' :
                          'bg-white/[0.03] border-white/10 hover:border-slate-300 text-slate-400'
                        }`}>
                        {t}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Priority VIP Up-sell wrapper */}
              <div className="pt-4 border-t border-white/5">
                <label className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/50 border border-amber-100/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={urgencyTier === 'express'}
                    onChange={(e) => setUrgencyTier(e.target.checked ? 'express' : 'standard')}
                    className="mt-1 rounded text-[#22C55E] focus:ring-[#22C55E] w-4 h-4"
                  />
                  <div className="text-start flex-1">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Sparkles size={12} className="text-[#22C55E]" />
                      Express Priority Dispatch (+50 SAR)
                    </span>
                    <p className="text-[11px] text-amber-700 leading-tight mt-0.5">
                      Bypass normal queues. Technician team targets your coordinates within maximum 90 minutes.
                    </p>
                  </div>
                </label>
              </div>

              <button onClick={() => setStep(2)} disabled={!canProceedStep1} type="button"
                className="btn-primary w-full justify-center bg-[#0B1120] hover:bg-[#1e293b] py-3 text-xs tracking-tight uppercase font-extrabold">
                Confirm Schedule &amp; Advance <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Step 2 — Address Input & Real-Time Logistics Simulation */}
          {step === 2 && (
            <div className="card p-6 space-y-5 animate-slide-up">
              <h2 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <MapPin size={16} className="text-[#22C55E]" /> Delivery Coordinates
              </h2>

              {/* Interactive map preview simulator panel */}
              <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Map size={12} /> Target Geofence Sandbox
                  </span>
                  <span className="text-[10px] bg-[#10B981]/10 text-[#10B981] px-1.5 py-0.5 rounded font-bold">
                    GPS Active
                  </span>
                </div>
                <div className="h-28 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center text-center p-3 relative">
                  <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981] animate-pulse">
                    <MapPin size={16} className="fill-[#10B981] text-white" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-300 mt-1">
                    {addressMode === 'saved' ? 'Saved Pin Selected' : newAddress.city || 'Riyadh Zone'}
                  </p>
                  <p className="text-[9px] text-slate-400">
                    {addressMode === 'saved' ? 'Static coordinates verified via auth cluster' : 'Ready to pin custom parameters'}
                  </p>
                </div>
              </div>

              {savedAddresses.length > 0 && (
                <div className="flex gap-2">
                  <button onClick={() => setAddressMode('saved')} type="button"
                    className={`flex-1 py-2 rounded-2xl text-xs font-bold border transition-all ${
                      addressMode === 'saved' ? 'bg-[#0B1120] text-white border-[#0B1120]' : 'bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/[0.03]'
                    }`}>
                    Saved Profiles
                  </button>
                  <button onClick={() => setAddressMode('new')} type="button"
                    className={`flex-1 py-2 rounded-2xl text-xs font-bold border transition-all ${
                      addressMode === 'new' ? 'bg-[#0B1120] text-white border-[#0B1120]' : 'bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/[0.03]'
                    }`}>
                    New Mapping
                  </button>
                </div>
              )}

              {addressMode === 'saved' && savedAddresses.length > 0 ? (
                <div className="space-y-2">
                  {savedAddresses.map(addr => (
                    <button key={addr._id} onClick={() => setSelectedAddressId(addr._id)} type="button"
                      className={`w-full p-3.5 rounded-2xl border text-start transition-all ${
                        selectedAddressId === addr._id ? 'border-[#22C55E] bg-[#22C55E]/5 shadow-2xl' : 'border-white/10 bg-white/[0.03] hover:border-slate-300'
                      }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-extrabold text-white bg-white/5 px-2 py-0.5 rounded tracking-tight uppercase">{addr.label}</span>
                        {addr.isDefault && <span className="text-[9px] font-bold text-[#10B981]">Default Asset</span>}
                      </div>
                      <p className="text-xs font-bold text-slate-200">{addr.fullAddress}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{addr.city}{addr.district ? `, ${addr.district}` : ''}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="label text-xs">Full Address Descriptor *</label>
                    <input className="input py-2 text-xs" placeholder="Street, compound number, villa/floor..."
                      value={newAddress.fullAddress} onChange={e => setNewAddress(a => ({ ...a, fullAddress: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label text-xs">Target Hub City *</label>
                      <input className="input py-2 text-xs" placeholder="Riyadh"
                        value={newAddress.city} onChange={e => setNewAddress(a => ({ ...a, city: e.target.value }))} />
                    </div>
                    <div>
                      <label className="label text-xs">District/Area</label>
                      <input className="input py-2 text-xs" placeholder="Al Olaya"
                        value={newAddress.district} onChange={e => setNewAddress(a => ({ ...a, district: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="label text-xs">Access Landmark</label>
                    <input className="input py-2 text-xs" placeholder="Near Gate 4, adjacent to park..."
                      value={newAddress.landmark} onChange={e => setNewAddress(a => ({ ...a, landmark: e.target.value }))} />
                  </div>
                </div>
              )}

              <div>
                <label className="label text-xs">Secure Dispatch Notes <span className="text-slate-400 font-normal">(Optional)</span></label>
                <textarea className="input resize-none py-2 text-xs" rows={2}
                  placeholder="Provide access security clearance or complex layout info..."
                  value={notes} onChange={e => setNotes(e.target.value)} />
              </div>

              <button onClick={() => setStep(3)} disabled={!canProceedStep2} type="button"
                className="btn-primary w-full justify-center bg-[#0B1120] hover:bg-[#1e293b] py-3 text-xs tracking-tight uppercase font-extrabold">
                Lock Address &amp; Review <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Step 3 — Secure Summary Review */}
          {step === 3 && (
            <div className="card p-6 space-y-5 animate-slide-up">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wide">Final Pre-Flight Authorization</h2>
              </div>

              <div className="space-y-3 bg-white/5 rounded-2xl p-4 border border-white/5">
                <RowItem label="Selected Tier" value={service.name} bold />
                <RowItem label="Scheduled Slot" value={`${selectedDate?.toLocaleDateString('en', { month: 'short', day: 'numeric' })} @ ${selectedTime}`} />
                <RowItem label="Target Vector" value={
                  addressMode === 'saved'
                    ? savedAddresses.find(a => a._id === selectedAddressId)?.fullAddress
                    : newAddress.fullAddress
                } />
                {urgencyTier === 'express' && (
                  <RowItem label="Dispatch Channel" value="⚡ EXPRESS DISPATCH (Priority Routing)" gold />
                )}
                {notes && <RowItem label="Attached String" value={notes} />}
              </div>

              <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-4">
                <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                  <HelpCircle size={14} className="text-[#22C55E]" /> SLA Transfer Requirements
                </p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Upon secure deployment, the backend sets your booking status to <strong className="font-bold">pending_payment</strong>. Upload wire transfer confirmation inside the generated dispatch details view within 24 hours to secure assignment.
                </p>
              </div>

              <button onClick={handleSubmit} disabled={loading} type="button"
                className="btn-primary w-full justify-center py-3.5 text-xs tracking-widest uppercase font-extrabold text-white">
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Authorize &amp; Generate Secure Booking'}
              </button>
            </div>
          )}

        </div>

        {/* Right Sticky Live Summary Block */}
        <div className="lg:col-span-5 sticky top-28 space-y-4">
          <div className="bg-[#0B1120] rounded-3xl p-5 text-white border border-white/10 shadow-2xl overflow-hidden relative">
            {/* Elegant light highlights */}
            <div className="absolute top-0 end-0 bg-gradient-to-l from-white/5 to-transparent px-3 py-1 text-[9px] font-extrabold tracking-widest uppercase text-[#22C55E] rounded-bl-xl">
              Live Total
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#22C55E] font-bold text-lg border border-white/10">
                ₪
              </div>
              <div>
                <p className="text-xs font-bold text-white line-clamp-1">{service.name}</p>
                <p className="text-[10px] text-slate-400">Duration SLA: {service.duration} mins</p>
              </div>
            </div>

            <div className="space-y-2 py-3 border-y border-white/10 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Base Tier Quoted</span>
                <span className="font-mono text-white">{formatCurrency(basePrice)}</span>
              </div>
              {urgencyTier === 'express' && (
                <div className="flex justify-between text-[#22C55E]">
                  <span>Express Dispatch Surge</span>
                  <span className="font-mono">{formatCurrency(expressFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>Platform Commission Assurance</span>
                <span>Included (30%)</span>
              </div>
            </div>

            <div className="pt-3 flex justify-between items-baseline">
              <span className="text-[11px] font-bold uppercase tracking-tight text-slate-400">Total Calculation</span>
              <span className="text-2xl font-extrabold text-[#22C55E] font-mono tracking-tight">{formatCurrency(finalTotal)}</span>
            </div>

            {/* Micro layout tracking status bars */}
            <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>Scheduler Matrix</span>
                <span className={selectedDate && selectedTime ? "text-[#10B981] font-bold" : "text-amber-400"}>
                  {selectedDate && selectedTime ? "Ready" : "Pending Selection"}
                </span>
              </div>
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>Geofence Targeting</span>
                <span className={step > 1 ? "text-[#10B981] font-bold" : "text-slate-500"}>
                  {step > 1 ? "Locked" : "Awaiting Parameters"}
                </span>
              </div>
            </div>
          </div>

          {/* Assurance info footer card */}
          <div className="card p-4 bg-white/5 text-[10px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-300">🔒 Zero Fraud Guarantee</p>
            <p>Payments route strictly through escrow accounts with full manual backstop controls.</p>
          </div>
        </div>

      </div>
    </div>
  )
}

function RowItem({ label, value, bold, gold }) {
  return (
    <div className="flex justify-between gap-4 text-xs">
      <span className="text-slate-400">{label}</span>
      <span className={`text-right ${
        gold ? 'text-[#22C55E] font-extrabold tracking-wide' :
        bold ? 'text-white font-bold' :
        'text-slate-300 font-medium'
      }`}>{value}</span>
    </div>
  )
}
