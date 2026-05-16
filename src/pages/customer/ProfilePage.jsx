import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { usersAPI, authAPI } from '../../api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { User, MapPin, Lock, Plus, Trash2, Loader2, Check } from 'lucide-react'
import { InlineLoader } from '../../components/common/LoadingSpinner'

export default function ProfilePage() {
  const { updateUser } = useAuth()
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState('profile')

  const { data: user, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => usersAPI.getProfile(),
    select: d => d.data.data.user
  })

  if (isLoading) return <InlineLoader />

  return (
    <div className="animate-fade-in max-w-xl">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-2xl mb-6 w-fit">
        {[
          { key: 'profile', label: 'Profile', icon: User },
          { key: 'addresses', label: 'Addresses', icon: MapPin },
          { key: 'security', label: 'Security', icon: Lock },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === t.key ? 'glass text-white shadow-2xl' : 'text-slate-500 hover:text-slate-300'}`}>
            <t.icon size={14} />{t.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && <ProfileTab user={user} onUpdated={() => qc.invalidateQueries(['profile'])} updateUser={updateUser} />}
      {activeTab === 'addresses' && <AddressesTab user={user} onUpdated={() => qc.invalidateQueries(['profile'])} />}
      {activeTab === 'security' && <SecurityTab />}
    </div>
  )
}

function ProfileTab({ user, onUpdated, updateUser }) {
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', bio: user.bio || '' })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data } = await usersAPI.updateProfile(form)
      updateUser(data.data.user)
      toast.success('Profile updated!')
      onUpdated()
    } catch { toast.error('Failed to update profile.') }
    finally { setSaving(false) }
  }

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-4 pb-4 border-b border-white/5">
        <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-2xl font-bold">
          {user.name?.split(' ').slice(0,2).map(w => w[0]).join('')}
        </div>
        <div>
          <p className="font-bold text-white text-lg">{user.name}</p>
          <p className="text-sm text-slate-400">{user.email}</p>
        </div>
      </div>

      <div>
        <label className="label">Full name</label>
        <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      </div>
      <div>
        <label className="label">Phone number</label>
        <input type="tel" className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
      </div>
      <div>
        <label className="label">Bio</label>
        <textarea className="input-glass resize-none" rows={3} value={form.bio}
          onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell us about yourself…" />
      </div>
      <button onClick={handleSave} disabled={saving} className="btn-primary">
        {saving ? <Loader2 size={16} className="animate-spin" /> : <><Check size={15} /> Save changes</>}
      </button>
    </div>
  )
}

function AddressesTab({ user, onUpdated }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ label: 'Home', fullAddress: '', city: '', district: '', landmark: '', isDefault: false })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const handleAdd = async () => {
    if (!form.fullAddress || !form.city) return toast.error('Address and city are required')
    setSaving(true)
    try {
      await usersAPI.addAddress(form)
      toast.success('Address added!')
      setShowForm(false)
      setForm({ label: 'Home', fullAddress: '', city: '', district: '', landmark: '', isDefault: false })
      onUpdated()
    } catch { toast.error('Failed to add address.') }
    finally { setSaving(false) }
  }

  const handleDelete = async (addressId) => {
    setDeleting(addressId)
    try {
      await usersAPI.deleteAddress(addressId)
      toast.success('Address removed.')
      onUpdated()
    } catch { toast.error('Failed to delete address.') }
    finally { setDeleting(null) }
  }

  return (
    <div className="space-y-3">
      {user.addresses?.map(addr => (
        <div key={addr._id} className="glass-card p-4 flex items-start gap-3">
          <div className="w-9 h-9 bg-brand-50 rounded-2xl flex items-center justify-center flex-shrink-0">
            <MapPin size={16} className="text-brand-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">{addr.label}</span>
              {addr.isDefault && <span className="text-xs text-slate-400">Default</span>}
            </div>
            <p className="text-sm text-slate-300">{addr.fullAddress}</p>
            <p className="text-xs text-slate-400 mt-0.5">{addr.city}{addr.district ? `, ${addr.district}` : ''}</p>
          </div>
          <button onClick={() => handleDelete(addr._id)} disabled={deleting === addr._id}
            className="text-slate-300 hover:text-red-400 transition-colors p-1">
            {deleting === addr._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          </button>
        </div>
      ))}

      {!showForm ? (
        <button onClick={() => setShowForm(true)}
          className="w-full border-2 border-dashed border-white/10 rounded-2xl p-4 text-sm text-slate-500 hover:border-brand-300 hover:text-brand-600 transition-colors flex items-center justify-center gap-2">
          <Plus size={16} /> Add new address
        </button>
      ) : (
        <div className="glass-card p-5 space-y-3">
          <h3 className="font-semibold text-white">New address</h3>
          <div>
            <label className="label">Label</label>
            <select className="input" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}>
              {['Home', 'Work', 'Other'].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Full address *</label>
            <input className="input" value={form.fullAddress} onChange={e => setForm(f => ({ ...f, fullAddress: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">City *</label>
              <input className="input" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
            </div>
            <div>
              <label className="label">District</label>
              <input className="input" value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleAdd} disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <Loader2 size={15} className="animate-spin" /> : 'Save address'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SecurityTab() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [saving, setSaving] = useState(false)

  const handleChange = async () => {
    if (form.newPassword !== form.confirmPassword) return toast.error('Passwords do not match')
    if (form.newPassword.length < 8) return toast.error('Password must be at least 8 characters')
    setSaving(true)
    try {
      await authAPI.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword })
      toast.success('Password changed successfully!')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch { toast.error('Failed to change password.') }
    finally { setSaving(false) }
  }

  return (
    <div className="glass-card p-6 space-y-4">
      <h3 className="font-semibold text-white">Change password</h3>
      {['currentPassword', 'newPassword', 'confirmPassword'].map((key) => (
        <div key={key}>
          <label className="label capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</label>
          <input type="password" className="input" value={form[key]}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
        </div>
      ))}
      <button onClick={handleChange} disabled={saving} className="btn-primary">
        {saving ? <Loader2 size={16} className="animate-spin" /> : 'Update password'}
      </button>
    </div>
  )
}
