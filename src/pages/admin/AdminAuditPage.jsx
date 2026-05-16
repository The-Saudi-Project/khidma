import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { auditAPI } from '../../api'
import { formatDateTime } from '../../utils/helpers'
import { ShieldCheck, Search } from 'lucide-react'
import { InlineLoader, EmptyState, Pagination } from '../../components/common/LoadingSpinner'

const ACTION_COLORS = {
  'auth.': 'bg-white/5 text-slate-300',
  'booking.': 'bg-brand-50 text-brand-700',
  'payment.': 'bg-amber-50 text-amber-700',
  'payout.': 'bg-emerald-50 text-emerald-700',
  'service.': 'bg-brand-500/10 text-brand-400',
  'user.': 'bg-red-50 text-red-700',
}

const getActionColor = (action) => {
  for (const [prefix, cls] of Object.entries(ACTION_COLORS)) {
    if (action?.startsWith(prefix)) return cls
  }
  return 'bg-white/5 text-slate-400'
}

export default function AdminAuditPage() {
  const [action, setAction] = useState('')
  const [actionInput, setActionInput] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', { action, page }],
    queryFn: () => auditAPI.getLogs({ action: action || undefined, page, limit: 50 }),
    select: d => d.data
  })

  const logs = data?.data?.logs || []
  const meta = data?.meta

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Audit Log</h1>
        <p className="page-subtitle">Complete trail of all platform actions</p>
      </div>

      <form onSubmit={e => { e.preventDefault(); setAction(actionInput); setPage(1) }} className="relative mb-5 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="input-glass pl-9 py-2.5 text-sm" placeholder="Filter by action (e.g. booking, payment)…"
          value={actionInput} onChange={e => setActionInput(e.target.value)} />
      </form>

      {isLoading ? <InlineLoader /> : logs.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="No audit logs found" />
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Action</th>
                <th>Performed By</th>
                <th>Description</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id}>
                  <td className="text-slate-400 text-xs whitespace-nowrap">{formatDateTime(log.createdAt)}</td>
                  <td>
                    <span className={`text-xs font-mono px-2 py-1 rounded-lg font-medium ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td>
                    <p className="text-sm font-medium text-white">{log.performedBy?.name || 'System'}</p>
                    <p className="text-xs text-slate-400 capitalize">{log.performedByRole}</p>
                  </td>
                  <td className="text-slate-400 text-sm max-w-xs truncate">{log.description}</td>
                  <td className="text-slate-400 font-mono text-xs">{log.ipAddress || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination meta={meta} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
