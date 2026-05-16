import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../api'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck, Zap } from 'lucide-react'
import Logo from '../../components/common/Logo'

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: SignupPage
// PURPOSE: Split-screen registration view. Includes tabs for Customer / Provider.
// ─────────────────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  // Added 'role' for tab state, defaulting to customer
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'customer' })
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
      else if (user.role === 'provider') navigate('/provider')
      else navigate('/services')
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
  
  // Tab change handler
  const setRole = (role) => {
    setForm(f => ({ ...f, role }))
    setErrors({})
  }

  return (
    <div className="min-h-screen glass flex flex-row-reverse">
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* RIGHT PANEL: Value Prop & Branding (Hidden on mobile) */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex w-1/2 bg-[#0B1120] relative flex-col justify-between p-12 overflow-hidden">
        {/* Abstract Lighting Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#22C55E]/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#22C55E]/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />

        {/* Top: Logo & Back Link */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <Logo />
          </Link>
          <Link to="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            Return to site
            <ArrowLeft size={16} className="rotate-180" />
          </Link>
        </div>

        {/* Center: Hero Copy */}
        <div className="relative z-10 max-w-md mt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <Zap size={14} className="text-[#22C55E] fill-[#22C55E]" />
            <span className="text-xs font-bold text-white uppercase tracking-tight">Fast, Secure, Reliable</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#86EFAC]">Khidma</span> Network.
          </h1>
          <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10">
            {form.role === 'customer' 
              ? 'Create your account to unlock premium home services, transparent pricing, and absolute peace of mind.'
              : 'Apply to join our vetted talent fleet. Maximize your earnings with zero hidden fees and full schedule control.'}
          </p>

          <div className="space-y-4">
            {(form.role === 'customer' 
              ? [
                  'Direct booking with verified professionals',
                  'Secure, escrow-backed payments',
                  '24/7 dedicated concierges'
                ]
              : [
                  'Instant gig notifications',
                  'Guaranteed digital payouts',
                  'Provider protection policies'
                ]
            ).map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                <ShieldCheck size={20} className="text-[#10B981]" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Minimalist footer */}
        <div className="relative z-10 mt-auto pt-20 flex items-center gap-4 text-slate-400 text-sm font-medium">
          <span>© {new Date().getFullYear()} Khidma</span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* LEFT PANEL: Signup Form */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 xl:p-24 relative overflow-y-auto">
        
        {/* Mobile Header (Only visible on small screens) */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8" showText={true} />
          </Link>
          <Link to="/" className="text-sm text-slate-500 font-medium hover:text-white">
            Cancel
          </Link>
        </div>

        <div className="w-full max-w-md mt-12 lg:mt-0">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Create an account</h2>
            <p className="text-slate-500 font-medium">Join Khidma and get started in seconds.</p>
          </div>

          {/* Account Type Tabs */}
          <div className="flex p-1 bg-white/5 rounded-2xl mb-8">
            <button
              onClick={() => setRole('customer')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                form.role === 'customer' 
                  ? 'glass text-white shadow-[0_2px_8px_rgba(8,18,37,0.08)]' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setRole('provider')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                form.role === 'provider' 
                  ? 'glass text-white shadow-[0_2px_8px_rgba(8,18,37,0.08)]' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Service Provider
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1.5">Full name</label>
              <input 
                className={`w-full px-4 py-3 rounded-2xl border glass border-white/10 text-white focus:glass focus:ring-2 focus:ring-[#22C55E] focus:border-[#22C55E] transition-all font-medium placeholder:font-normal ${errors.name ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
                placeholder="Ahmed Al-Rashid"
                value={form.name} onChange={set('name')} autoComplete="name" 
              />
              {errors.name && <p className="text-xs text-red-500 font-bold mt-1.5">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1.5">Email address</label>
              <input type="email" 
                className={`w-full px-4 py-3 rounded-2xl border glass border-white/10 text-white focus:glass focus:ring-2 focus:ring-[#22C55E] focus:border-[#22C55E] transition-all font-medium placeholder:font-normal ${errors.email ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
                placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email" 
              />
              {errors.email && <p className="text-xs text-red-500 font-bold mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1.5">Phone number <span className="text-slate-400 font-normal">(optional)</span></label>
              <input type="tel" 
                className="w-full px-4 py-3 rounded-2xl border glass border-white/10 text-white focus:glass focus:ring-2 focus:ring-[#22C55E] focus:border-[#22C55E] transition-all font-medium placeholder:font-normal"
                placeholder="+966 5X XXX XXXX" value={form.phone} onChange={set('phone')} autoComplete="tel" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'}
                  className={`w-full px-4 py-3 rounded-2xl border glass border-white/10 text-white focus:glass focus:ring-2 focus:ring-[#22C55E] focus:border-[#22C55E] transition-all font-medium placeholder:font-normal pr-12 ${errors.password ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
                  placeholder="Min. 8 characters" value={form.password} onChange={set('password')} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-400 transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 font-bold mt-1.5">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#0B1120] text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-[#112240] active:bg-[#060d1a] transition-all flex justify-center items-center gap-2 mt-6 shadow-[0_4px_14px_0_rgba(8,18,37,0.15)] disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Create account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-500 font-bold hover:text-brand-400 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

