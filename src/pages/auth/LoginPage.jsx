import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../api'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck, Star } from 'lucide-react'
import Logo from '../../components/common/Logo'

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: LoginPage
// PURPOSE: Split-screen authentication view (Desktop: Image/Value Prop left, Form right. Mobile: Stacked).
// ─────────────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { data } = await authAPI.login(form)
      const { accessToken, refreshToken, user } = data.data
      login({ accessToken, refreshToken }, user)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      if (user.mustChangePassword) {
        navigate('/change-password', { replace: true })
      } else if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'provider') navigate('/provider')
      else navigate('/services')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1120] flex selection:bg-brand-500/30">
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* LEFT PANEL: Value Prop & Branding (Hidden on mobile) */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex w-1/2 bg-[#0B1120] relative flex-col justify-between p-16 overflow-hidden">
        {/* Abstract Lighting Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiLz48L3N2Zz4=')] opacity-30" />

        {/* Top: Logo & Back Link */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <Logo />
          </Link>
          <Link to="/" className="text-sm font-bold text-slate-500 hover:text-white transition-all flex items-center gap-2 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to site
          </Link>
        </div>

        {/* Center: Hero Copy */}
        <div className="relative z-10 max-w-lg mt-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-8 backdrop-blur-md">
            <Star size={14} className="text-brand-500 fill-brand-500" />
            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.2em]">Trusted Platform</span>
          </div>
          <h1 className="text-6xl font-extrabold text-white leading-[1.05] tracking-tight mb-8">
            Welcome <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-brand-500">
              back.
            </span>
          </h1>
          <p className="text-lg text-slate-400 font-medium leading-relaxed mb-12">
            Sign in to book services, track your professionals, and manage your home maintenance.
          </p>

          <div className="grid grid-cols-1 gap-6">
            {[
              'Track your bookings',
              'Secure payments'
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-400 font-bold text-sm uppercase tracking-wide">
                <ShieldCheck size={20} className="text-brand-500" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Minimalist footer/testimonial placeholder */}
        <div className="relative z-10 mt-auto pt-20">
          <div className="border-l-2 border-brand-500 pl-6">
            <p className="text-white font-medium italic mb-2">
              "Khidma completely redefined how we manage our facilities. The interface is flawless."
            </p>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-tight">
              — Director of Operations, Riyadh Hub
            </p>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* RIGHT PANEL: Login Form */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative">
        
        {/* Mobile Header (Only visible on small screens) */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8" showText={true} />
          </Link>
          <Link to="/" className="text-sm text-slate-500 font-medium hover:text-white">
            Cancel
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Email address</label>
              <input
                type="email"
                className={`input-glass ${errors.email ? 'border-red-500/50' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                autoComplete="email"
              />
              {errors.email && <p className="text-xs text-red-500 font-bold mt-1.5">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs text-brand-500 hover:text-brand-400 font-bold transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className={`input-glass pr-12 ${errors.password ? 'border-red-500/50' : ''}`}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 font-bold mt-1.5">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-xs tracking-widest uppercase font-black">
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Log In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="text-brand-500 font-bold hover:text-brand-400 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

