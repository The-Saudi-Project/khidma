import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { usersAPI, authAPI } from '../../api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Check, Loader2, ToggleLeft, ToggleRight } from 'lucide-react'
import { InlineLoader } from '../../components/common/LoadingSpinner'

export default function ProviderProfilePage() {
  const { user: authUser, updateUser } = useAuth()
  const qc = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => usersAPI.getProfile(),
    select: d => d.data.data.user
  })

  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toggling, setToggling] = useState(false)

  if (isLoading) return <InlineLoader />

  const profileForm = form || { name: user.name, phone: user.phone || '', bio: user.bio || '' }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data } = await usersAPI.updateProfile(profileForm)
      updateUser(data.data.user)
      qc.invalidateQueries(['profile'])
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update.') }
    finally { setSaving(false) }
  }

  const handleToggleAvailability = async () => {
    setToggling(true)
    try {
      const newVal = !user.providerProfile?.isAvailable
      await usersAPI.updateAvailability(newVal)
      qc.invalidateQueries(['profile'])
      toast.success(`You are now ${newVal ? 'available' : 'unavailable'} for jobs.`)
    } catch { toast.error('Failed to update availability.') }
    finally { setToggling(false) }
  }

  const isAvailable = user.providerProfile?.isAvailable

  return (
    <div className="animate-fade-in max-w-xl">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
      </div>

      {/* Availability toggle */}
      <div className="card p-5 mb-4 flex items-center gap-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${isAvailable ? 'bg-emerald-50' : 'bg-white/5'}`}>
          {isAvailable
            ? <ToggleRight size={20} className="text-emerald-600" />
            : <ToggleLeft size={20} className="text-slate-400" />}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white">Availability</p>
          <p className="text-sm text-slate-500">{isAvailable ? 'You are accepting new jobs' : 'You are not accepting jobs'}</p>
        </div>
        <button onClick={handleToggleAvailability} disabled={toggling}
          className={`btn btn-sm ${isAvailable ? 'btn-secondary' : 'btn-primary'}`}>
          {toggling ? <Loader2 size={14} className="animate-spin" /> : isAvailable ? 'Go offline' : 'Go online'}
        </button>
      </div>

      {/* Profile stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Rating', value: (user.providerProfile?.averageRating || 0).toFixed(1) + ' ★' },
          { label: 'Reviews', value: user.providerProfile?.totalReviews || 0 },
          { label: 'Completed', value: user.providerProfile?.completedJobs || 0 },
        ].map(s => (
          <div key={s.label} className="card p-3 text-center">
            <p className="text-lg font-bold text-white">{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Edit form */}
      <div className="card p-5 space-y-4">
        <h3 className="font-semibold text-white">Personal Information</h3>
        <div>
          <label className="label">Full name</label>
          <input className="input" value={profileForm.name}
            onChange={e => setForm(f => ({ ...(f || profileForm), name: e.target.value }))} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input type="tel" className="input" value={profileForm.phone}
            onChange={e => setForm(f => ({ ...(f || profileForm), phone: e.target.value }))} />
        </div>
        <div>
          <label className="label">Bio</label>
          <textarea className="input resize-none" rows={3} value={profileForm.bio}
            onChange={e => setForm(f => ({ ...(f || profileForm), bio: e.target.value }))}
            placeholder="Describe your experience and skills…" />
        </div>

        {user.providerProfile?.skills?.length > 0 && (
          <div>
            <label className="label">Skills</label>
            <div className="flex flex-wrap gap-2">
              {user.providerProfile.skills.map((s, i) => (
                <span key={i} className="badge-premium">{s}</span>
              ))}
            </div>
          </div>
        )}

        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <><Check size={15} /> Save changes</>}
        </button>
      </div>
    </div>
  )
}
