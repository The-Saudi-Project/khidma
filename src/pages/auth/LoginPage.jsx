import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../api'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck, Star } from 'lucide-react'

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
    <div className="min-h-screen bg-white flex">
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* LEFT PANEL: Value Prop & Branding (Hidden on mobile) */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex w-1/2 bg-[#081225] relative flex-col justify-between p-12 overflow-hidden">
        {/* Abstract Lighting Elements */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 translate-y-1/3" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />

        {/* Top: Logo & Back Link */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#C5A059] rounded-xl flex items-center justify-center font-black text-xl text-[#081225] shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-transform group-hover:scale-105">
              K
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">Khidma</span>
          </Link>
          <Link to="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={16} />
            Return to site
          </Link>
        </div>

        {/* Center: Hero Copy */}
        <div className="relative z-10 max-w-md mt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <Star size={14} className="text-[#C5A059] fill-[#C5A059]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Premium Service Layer</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
            Log in to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-[#E2C78D]">Khidma</span> dashboard.
          </h1>
          <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10">
            Access your secure portal to manage bookings, track service professionals, and maintain your property with absolute precision.
          </p>

          <div className="space-y-4">
            {[
              'Bank-grade encrypted transactions',
              'Vetted, tier-1 service professionals',
              'Real-time SLA tracking'
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                <ShieldCheck size={20} className="text-[#10B981]" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Minimalist footer/testimonial placeholder */}
        <div className="relative z-10 mt-auto pt-20">
          <div className="border-l-2 border-[#C5A059] pl-6">
            <p className="text-white font-medium italic mb-2">
              "Khidma completely redefined how we manage our facilities. The interface is flawless."
            </p>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
              — Director of Operations, Riyadh
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
            <div className="w-8 h-8 bg-[#081225] rounded-lg flex items-center justify-center font-black text-[#C5A059]">K</div>
            <span className="font-extrabold text-[#081225] text-lg">Khidma</span>
          </Link>
          <Link to="/" className="text-sm text-slate-500 font-medium hover:text-slate-900">
            Cancel
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email address</label>
              <input
                type="email"
                className={`w-full px-4 py-3.5 rounded-xl border bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all font-medium placeholder:font-normal ${errors.email ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                autoComplete="email"
              />
              {errors.email && <p className="text-xs text-red-500 font-bold mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-sm text-[#C5A059] hover:text-[#b08e4d] font-bold transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className={`w-full px-4 py-3.5 rounded-xl border bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all font-medium placeholder:font-normal pr-12 ${errors.password ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 font-bold mt-1.5">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#081225] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#112240] active:bg-[#060d1a] transition-all flex justify-center items-center gap-2 mt-4 shadow-[0_4px_14px_0_rgba(8,18,37,0.15)] disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#C5A059] font-bold hover:text-[#b08e4d] transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

