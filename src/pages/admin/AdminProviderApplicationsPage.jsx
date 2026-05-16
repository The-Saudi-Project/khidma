import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { providerInterestAPI } from '../../api'
import toast from 'react-hot-toast'
import { Loader2, ChevronDown, ChevronUp, Check, X } from 'lucide-react'
import { InlineLoader, Pagination } from '../../components/common/LoadingSpinner'

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

      <div className="flex gap-2 mb-6 flex-wrap">
        {['pending', 'approved', 'rejected', 'all'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => { setStatus(s); setPage(1) }}
            className={`px-4 py-2 rounded-2xl text-sm font-semibold capitalize ${
              status === s ? 'bg-brand-600 text-white' : 'glass border border-white/10 text-slate-400'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {applications.length === 0 && (
          <p className="text-slate-500 text-center py-12">No applications in this tab.</p>
        )}
        {applications.map((a) => (
          <div key={a._id} className="rounded-2xl border border-white/5 glass overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center justify-between p-4 text-left hover:glass"
              onClick={() => setOpenId(openId === a._id ? null : a._id)}
            >
              <div>
                <p className="font-semibold text-white">{a.name}</p>
                <p className="text-xs text-slate-500">{a.email} · {a.city}</p>
              </div>
              <span className="flex items-center gap-2 text-xs font-medium uppercase text-slate-500">
                {a.status}
                {openId === a._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
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
