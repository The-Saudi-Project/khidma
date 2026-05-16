import { useState } from 'react'
import { Link } from 'react-router-dom'
import { providerInterestAPI } from '../../api'
import toast from 'react-hot-toast'
import { Loader2, CheckCircle } from 'lucide-react'

const SKILL_OPTIONS = [
  'Cleaning', 'AC & Appliances', 'Plumbing', 'Electrical', 'Painting',
  'Pest Control', 'Handyman', 'Gardening', 'Moving'
]

export default function BecomeProviderSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    skills: [],
    experience: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const toggleSkill = (s) => {
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(s) ? f.skills.filter((x) => x !== s) : [...f.skills, s]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.skills.length) {
      toast.error('Select at least one skill.')
      return
    }
    setSubmitting(true)
    try {
      await providerInterestAPI.submit(form)
      setDone(true)
      toast.success('Application received!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit application.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <section className="py-24 px-4 glass relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(#22C55E_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.15]" />
        
        <div className="max-w-xl mx-auto text-center relative z-10 glass rounded-[2rem] p-12 border border-white/5 shadow-[0_20px_60px_-15px_rgba(8,18,37,0.05)]">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
            <CheckCircle className="w-10 h-10 text-brand-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">Telemetry Acknowledged</h2>
          <p className="text-sm text-slate-500 mb-8 font-medium leading-relaxed max-w-md mx-auto">
            Your technical dossier has been indexed into our Master Tier talent routing matrix. Authorization credentials will be delivered via secure terminal stream.
          </p>
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0B1120] text-white font-extrabold uppercase text-xs tracking-widest hover:bg-[#22C55E] hover:text-white transition-all duration-300 shadow-md"
          >
            <span>Access Node Stream</span>
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section id="become-provider" className="py-28 px-4 glass border-t border-white/5 relative overflow-hidden">
      {/* Decorative layout anchor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-slate-50/50 to-transparent pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass border border-white/5 mb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#22C55E]">Network Authorization</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Integrate as Vetted Talent
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Join the Kingdom&apos;s leading network of elite technicians operating under Master Tier dispatch protocols.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 sm:p-12 border border-white/5 shadow-[0_20px_80px_-15px_rgba(8,18,37,0.08)] relative overflow-hidden">
          {/* Subtle gradient strip top header */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0B1120]" />

          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-tight text-white mb-2">Full Identity Name</label>
              <input 
                className="w-full glass border border-white/5 rounded-2xl px-4 py-3.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B1120]/10 font-medium transition-all" 
                placeholder="e.g. Tariq Al-Mansour"
                required 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-tight text-white mb-2">Secure Email</label>
              <input 
                type="email" 
                className="w-full glass border border-white/5 rounded-2xl px-4 py-3.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B1120]/10 font-medium transition-all" 
                placeholder="tariq@enterprise.sa"
                required 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-tight text-white mb-2">Terminal Contact (Phone)</label>
              <input 
                className="w-full glass border border-white/5 rounded-2xl px-4 py-3.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B1120]/10 font-medium transition-all" 
                placeholder="+966 5X XXX XXXX"
                required 
                value={form.phone} 
                onChange={(e) => setForm({ ...form, phone: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-tight text-white mb-2">Primary Grid (City)</label>
              <input 
                className="w-full glass border border-white/5 rounded-2xl px-4 py-3.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B1120]/10 font-medium transition-all" 
                placeholder="Riyadh, Jeddah, Dammam..."
                required 
                value={form.city} 
                onChange={(e) => setForm({ ...form, city: e.target.value })} 
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[10px] font-extrabold uppercase tracking-tight text-white mb-2.5">Authorized Modules (Select Scope)</label>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleSkill(s)}
                  className={`px-4 py-2 rounded-2xl text-xs font-extrabold tracking-tight uppercase transition-all duration-300 border ${
                    form.skills.includes(s)
                      ? 'bg-[#0B1120] text-white border-[#0B1120] shadow-md'
                      : 'glass text-slate-500 border-white/10 hover:border-[#0B1120]/30 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-[10px] font-extrabold uppercase tracking-tight text-white mb-2">Technical Dossier &amp; Certifications</label>
            <textarea 
              className="w-full glass border border-white/5 rounded-2xl p-4 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B1120]/10 font-medium transition-all min-h-[120px]" 
              value={form.experience} 
              onChange={(e) => setForm({ ...form, experience: e.target.value })} 
              placeholder="Outline your years of active duty, specialized tools operated, and regional coverage limitations..." 
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting} 
            className="btn-primary w-full py-4 text-xs tracking-[0.2em] uppercase font-black"
          >
            {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Transmit Dossier Authorization'}
          </button>
        </form>
      </div>
    </section>
  )
}
