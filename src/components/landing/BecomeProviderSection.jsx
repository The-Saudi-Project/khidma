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
      <section className="py-16 px-4 bg-surface-50 border-y border-slate-100">
        <div className="max-w-xl mx-auto text-center">
          <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank you!</h2>
          <p className="text-slate-600 mb-6">We will review your application and contact you by email.</p>
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">Log in to an existing account</Link>
        </div>
      </section>
    )
  }

  return (
    <section id="become-provider" className="py-16 px-4 bg-white border-y border-slate-100">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Become a Khidma provider</h2>
        <p className="text-slate-600 text-center mb-8 text-sm">Join our vetted network of home service professionals across Saudi Arabia.</p>
        <form onSubmit={handleSubmit} className="space-y-4 bg-surface-50 rounded-3xl p-6 border border-slate-100">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Full name</label>
              <input className="input w-full" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
              <input type="email" className="input w-full" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Phone</label>
              <input className="input w-full" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">City</label>
              <input className="input w-full" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">Skills</label>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleSkill(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    form.skills.includes(s)
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Experience</label>
            <textarea className="input w-full min-h-[100px]" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="Years of experience, certifications, coverage area…" />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
            {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Submit application'}
          </button>
        </form>
      </div>
    </section>
  )
}
