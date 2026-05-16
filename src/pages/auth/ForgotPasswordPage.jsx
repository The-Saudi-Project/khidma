import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../../api'
import toast from 'react-hot-toast'
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Please enter your email')
    setLoading(true)
    try {
      await authAPI.forgotPassword(email)
      setSent(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-white/[0.03] rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <span className="text-brand-700 font-bold text-xl">K</span>
          </div>
          <span className="text-white font-bold text-3xl tracking-tight">Khidma</span>
        </div>

        <div className="bg-white/[0.03] rounded-3xl shadow-modal p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-brand-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
              <p className="text-sm text-slate-500 mb-6">
                If an account exists for <strong>{email}</strong>, we've sent password reset instructions.
              </p>
              <Link to="/login" className="btn-primary w-full justify-center">Back to login</Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 mb-6">
                <ArrowLeft size={16} /> Back to login
              </Link>
              <h1 className="text-2xl font-bold text-white mb-1">Reset password</h1>
              <p className="text-slate-500 text-sm mb-7">Enter your email and we'll send reset instructions.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Email address</label>
                  <input type="email" className="input" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send reset link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
