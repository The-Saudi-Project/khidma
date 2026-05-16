import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../api'
import toast from 'react-hot-toast'
import { Loader2, Eye, EyeOff } from 'lucide-react'

function defaultRoute(role) {
  if (role === 'admin') return '/admin'
  if (role === 'provider') return '/provider'
  return '/services'
}

export default function ChangePasswordPage() {
  const { user, login, updateUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [show, setShow] = useState({ cur: false, nw: false })
  const [loading, setLoading] = useState(false)

  if (!user) return <Navigate to="/login" replace />
  if (!user.mustChangePassword) return <Navigate to={defaultRoute(user.role)} replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirm) {
      toast.error('New passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const { data } = await authAPI.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      })
      const { accessToken, refreshToken } = data.data
      login({ accessToken, refreshToken }, { ...user, mustChangePassword: false })
      const me = await authAPI.getMe()
      updateUser(me.data.data.user)
      toast.success('Password updated.')
      navigate(defaultRoute(user.role), { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass rounded-3xl shadow-modal p-8 border border-white/5">
        <h1 className="text-xl font-bold text-white mb-1">Update your password</h1>
        <p className="text-sm text-slate-500 mb-6">You must set a new password before continuing. · يجب تعيين كلمة مرور جديدة.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500">Current password</label>
            <div className="relative mt-1">
              <input
                type={show.cur ? 'text' : 'password'}
                className="input-glass w-full pe-10"
                required
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              />
              <button type="button" className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShow((s) => ({ ...s, cur: !s.cur }))}>
                {show.cur ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">New password</label>
            <div className="relative mt-1">
              <input
                type={show.nw ? 'text' : 'password'}
                className="input-glass w-full pe-10"
                required
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              />
              <button type="button" className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShow((s) => ({ ...s, nw: !s.nw }))}>
                {show.nw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Confirm new password</label>
            <input
              type="password"
              className="input-glass w-full mt-1"
              required
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Save and continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
