import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../api'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'

export default function SignupPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      e.password = 'Must contain uppercase, lowercase, and a number'
    }
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { data } = await authAPI.signup(form)
      const { accessToken, refreshToken, user } = data.data
      login({ accessToken, refreshToken }, user)
      toast.success('Account created! Welcome to Khidma.')
      if (user.mustChangePassword) navigate('/change-password', { replace: true })
      else navigate('/services')
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 flex items-center justify-center p-4 relative">
      {/* Back to Home */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors font-semibold text-sm group"
      >
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
          <ArrowLeft size={18} />
        </div>
        Back to Website
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-brand-700 font-bold text-xl">K</span>
            </div>
            <span className="text-white font-bold text-3xl tracking-tight">Khidma</span>
          </div>
          <p className="text-brand-200 text-sm">Premium Home Services · Saudi Arabia</p>
        </div>

        <div className="bg-white rounded-3xl shadow-modal p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Create account</h1>
          <p className="text-slate-500 text-sm mb-7">Get started with Khidma today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input className={`input ${errors.name ? 'input-error' : ''}`} placeholder="Ahmed Al-Rashid"
                value={form.name} onChange={set('name')} autoComplete="name" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="label">Email address</label>
              <input type="email" className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="label">Phone number <span className="text-slate-400 font-normal">(optional)</span></label>
              <input type="tel" className="input" placeholder="+966 5X XXX XXXX"
                value={form.phone} onChange={set('phone')} autoComplete="tel" />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'}
                  className={`input pr-11 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Min. 8 characters" value={form.password} onChange={set('password')} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary btn-lg w-full mt-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
