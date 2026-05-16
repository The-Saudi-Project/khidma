import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { providerInterestAPI } from '../../api'
import toast from 'react-hot-toast'
import { Loader2, ChevronDown, ChevronUp, Check, X } from 'lucide-react'
import { InlineLoader, Pagination, EmptyState } from '../../components/common/LoadingSpinner'
import { UserCheck } from 'lucide-react'

export default function AdminProviderApplicationsPage() {
  const qc = useQueryClient()
  const [status, setStatus] = useState('pending')
  const [page, setPage] = useState(1)
  const [openId, setOpenId] = useState(null)
  const [approvePwd, setApprovePwd] = useState({})
  const [lastTemp, setLastTemp] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['provider-applications', status, page],
    queryFn: () => providerInterestAPI.list({ status: status === 'all' ? undefined : status, page, limit: 15 }),
    select: (res) => ({
      applications: res.data.data.applications,
      meta: res.data.meta
    })
  })

  const applications = data?.applications || []
  const meta = data?.meta

  const approveMut = useMutation({
    mutationFn: ({ id, password }) => providerInterestAPI.approve(id, { password }),
    onSuccess: (res, variables) => {
      const pwd = res?.data?.data?.temporaryPassword
      if (pwd) setLastTemp(pwd)
      toast.success('Application approved.')
      qc.invalidateQueries({ queryKey: ['provider-applications'] })
      qc.invalidateQueries({ queryKey: ['admin-metrics'] })
      setApprovePwd((p) => ({ ...p, [variables.id]: '' }))
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Approve failed')
  })

  const rejectMut = useMutation({
    mutationFn: ({ id, reason }) => providerInterestAPI.reject(id, { reason }),
    onSuccess: () => {
      toast.success('Application rejected.')
      qc.invalidateQueries({ queryKey: ['provider-applications'] })
      qc.invalidateQueries({ queryKey: ['admin-metrics'] })
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Reject failed')
  })

  if (isLoading) return <InlineLoader />

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">Provider applications</h1>
        <p className="page-subtitle">Review and approve new provider interest submissions</p>
      </div>

      {lastTemp && (
        <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-900">
          <strong>Temporary password for new provider:</strong> <code className="select-all">{lastTemp}</code>
          <button type="button" className="ms-2 underline" onClick={() => setLastTemp(null)}>Dismiss</button>
        </div>
      )}

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {['pending', 'approved', 'rejected', 'all'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => { setStatus(s); setPage(1) }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize whitespace-nowrap ${
              status === s ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {applications.length === 0 && (
          <EmptyState icon={UserCheck} title={`No ${status} applications`} message="There are no applications in this category right now." />
        )}
        {applications.map((a) => (
          <div key={a._id} className="glass rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
              onClick={() => setOpenId(openId === a._id ? null : a._id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20 text-brand-400 font-bold">
                  {a.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-white text-base">{a.name}</p>
                  <p className="text-xs text-slate-400 font-medium">{a.email} <span className="text-white/20 mx-1">•</span> {a.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block ${
                  a.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                  a.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                  'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {a.status}
                </span>
                <span className="text-slate-500">
                  {openId === a._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </div>
            </button>
            {openId === a._id && (
              <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-3 text-sm">
                <p><span className="text-slate-500">Phone:</span> {a.phone}</p>
                <p><span className="text-slate-500">Skills:</span> {(a.skills || []).join(', ') || '—'}</p>
                <p className="text-slate-400 whitespace-pre-wrap">{a.experience || '—'}</p>
                {a.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <div className="flex-1 flex gap-2">
                      <input
                        type="password"
                        className="input-glass flex-1 text-sm"
                        placeholder="Temp password for new account"
                        value={approvePwd[a._id] || ''}
                        onChange={(e) => setApprovePwd((p) => ({ ...p, [a._id]: e.target.value }))}
                      />
                      <button
                        type="button"
                        disabled={approveMut.isPending}
                        className="btn-primary px-4 flex items-center gap-1"
                        onClick={() => approveMut.mutate({ id: a._id, password: approvePwd[a._id] })}
                      >
                        {approveMut.isPending ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                        Approve
                      </button>
                    </div>
                    <button
                      type="button"
                      className="btn-secondary border-red-200 text-red-600 flex items-center gap-1 justify-center"
                      onClick={() => {
                        const reason = window.prompt('Rejection reason?') || 'Not a fit at this time'
                        rejectMut.mutate({ id: a._id, reason })
                      }}
                    >
                      <X size={16} /> Reject
                    </button>
                  </div>
                )}
                {a.rejectionReason && <p className="text-red-600 text-xs">Reason: {a.rejectionReason}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Pagination meta={meta} onPageChange={setPage} />
      </div>
    </div>
  )
}
