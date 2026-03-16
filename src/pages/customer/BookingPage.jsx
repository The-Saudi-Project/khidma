import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { servicesAPI, bookingsAPI, usersAPI } from '../../api'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { ArrowLeft, Clock, MapPin, Calendar, ChevronRight, Plus, Loader2 } from 'lucide-react'
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
  const [newAddress, setNewAddress] = useState({ fullAddress: '', city: '', district: '', landmark: '' })
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

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

  const canProceedStep1 = selectedDate && selectedTime
  const canProceedStep2 = addressMode === 'saved'
    ? !!selectedAddressId
    : !!newAddress.fullAddress && !!newAddress.city

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        serviceId,
        scheduledDate: selectedDate.toISOString(),
        scheduledTime: selectedTime,
        notes,
        ...(addressMode === 'saved' ? { addressId: selectedAddressId } : { customAddress: newAddress })
      }
      const { data } = await bookingsAPI.createBooking(payload)
      toast.success('Booking created! Upload payment to confirm.')
      navigate(`/bookings/${data.data.booking._id}`)
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (serviceLoading) return <InlineLoader />
  if (!service) return <div className="text-center py-20 text-slate-400">Service not found.</div>

  return (
    <div className="animate-fade-in max-w-2xl">
      <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft size={16} /> {step > 1 ? 'Back' : 'Back to service'}
      </button>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {['Date & Time', 'Address', 'Review'].map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${step > i + 1 ? 'bg-emerald-500 text-white' :
                step === i + 1 ? 'bg-brand-600 text-white' :
                'bg-slate-100 text-slate-400'}`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-sm font-medium ${step === i + 1 ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
            {i < 2 && <div className="w-8 h-px bg-slate-200 mx-1" />}
          </div>
        ))}
      </div>

      {/* Service summary card */}
      <div className="card p-4 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-xl">🏠</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 truncate">{service.name}</p>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
            <span className="flex items-center gap-1"><Clock size={11} />{service.duration} min</span>
          </div>
        </div>
        <p className="font-bold text-slate-900 flex-shrink-0">{formatCurrency(service.price)}</p>
      </div>

      {/* Step 1 — Date & Time */}
      {step === 1 && (
        <div className="animate-slide-up space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-brand-600" /> Select date
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {availableDates.map((date, i) => {
                const isSelected = selectedDate?.toDateString() === date.toDateString()
                return (
                  <button key={i} onClick={() => setSelectedDate(date)}
                    className={`p-2 rounded-xl text-center transition-all border
                      ${isSelected ? 'bg-brand-600 text-white border-brand-600 shadow-sm' :
                        'bg-white border-slate-200 hover:border-brand-300 text-slate-700'}`}>
                    <div className="text-xs opacity-70">{date.toLocaleDateString('en', { weekday: 'short' })}</div>
                    <div className="text-sm font-bold mt-0.5">{date.getDate()}</div>
                    <div className="text-xs opacity-70">{date.toLocaleDateString('en', { month: 'short' })}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-brand-600" /> Select time
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {TIME_SLOTS.map(t => {
                const isSelected = selectedTime === t
                return (
                  <button key={t} onClick={() => setSelectedTime(t)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all border
                      ${isSelected ? 'bg-brand-600 text-white border-brand-600 shadow-sm' :
                        'bg-white border-slate-200 hover:border-brand-300 text-slate-700'}`}>
                    {t}
                  </button>
                )
              })}
            </div>
          </div>

          <button onClick={() => setStep(2)} disabled={!canProceedStep1}
            className="btn-primary btn-lg w-full">
            Continue <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Step 2 — Address */}
      {step === 2 && (
        <div className="animate-slide-up space-y-4">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-brand-600" /> Service address
          </h2>

          {savedAddresses.length > 0 && (
            <div className="flex gap-2 mb-4">
              <button onClick={() => setAddressMode('saved')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all
                  ${addressMode === 'saved' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white border-slate-200 text-slate-600'}`}>
                Saved address
              </button>
              <button onClick={() => setAddressMode('new')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all
                  ${addressMode === 'new' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white border-slate-200 text-slate-600'}`}>
                New address
              </button>
            </div>
          )}

          {(addressMode === 'saved' && savedAddresses.length > 0) ? (
            <div className="space-y-2">
              {savedAddresses.map(addr => (
                <button key={addr._id} onClick={() => setSelectedAddressId(addr._id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all
                    ${selectedAddressId === addr._id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white hover:border-brand-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">{addr.label}</span>
                    {addr.isDefault && <span className="text-xs text-slate-400">Default</span>}
                  </div>
                  <p className="text-sm text-slate-700">{addr.fullAddress}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{addr.city}{addr.district ? `, ${addr.district}` : ''}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="label">Full address *</label>
                <input className="input" placeholder="Street, building, floor…"
                  value={newAddress.fullAddress} onChange={e => setNewAddress(a => ({ ...a, fullAddress: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">City *</label>
                  <input className="input" placeholder="Riyadh"
                    value={newAddress.city} onChange={e => setNewAddress(a => ({ ...a, city: e.target.value }))} />
                </div>
                <div>
                  <label className="label">District</label>
                  <input className="input" placeholder="Al Olaya"
                    value={newAddress.district} onChange={e => setNewAddress(a => ({ ...a, district: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="label">Landmark</label>
                <input className="input" placeholder="Near the mosque, gate 2…"
                  value={newAddress.landmark} onChange={e => setNewAddress(a => ({ ...a, landmark: e.target.value }))} />
              </div>
            </div>
          )}

          <div>
            <label className="label">Notes for provider <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea className="input resize-none" rows={3}
              placeholder="Any special instructions or access details…"
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          <button onClick={() => setStep(3)} disabled={!canProceedStep2}
            className="btn-primary btn-lg w-full">
            Review booking <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Step 3 — Review */}
      {step === 3 && (
        <div className="animate-slide-up">
          <h2 className="text-lg font-bold text-slate-900 mb-5">Review your booking</h2>

          <div className="card p-5 space-y-4 mb-5">
            <Row label="Service" value={service.name} />
            <div className="divider !my-0" />
            <Row label="Date" value={selectedDate?.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })} />
            <Row label="Time" value={selectedTime} />
            <div className="divider !my-0" />
            <Row label="Address" value={
              addressMode === 'saved'
                ? savedAddresses.find(a => a._id === selectedAddressId)?.fullAddress
                : newAddress.fullAddress
            } />
            {notes && <Row label="Notes" value={notes} />}
            <div className="divider !my-0" />
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="text-xl font-bold text-brand-700">{formatCurrency(service.price)}</span>
            </div>
          </div>

          <div className="card p-4 bg-amber-50 border-amber-100 mb-5">
            <p className="text-sm text-amber-700 font-medium">Payment required</p>
            <p className="text-xs text-amber-600 mt-1">
              After booking, you'll need to upload payment proof within 24 hours to confirm your booking.
            </p>
          </div>

          <button onClick={handleSubmit} disabled={loading} className="btn-primary btn-lg w-full">
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Booking'}
          </button>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-900 font-medium text-right">{value}</span>
    </div>
  )
}
