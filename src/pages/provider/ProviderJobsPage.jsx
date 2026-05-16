import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { bookingsAPI } from '../../api'
import { formatDate, formatCurrency, getStatusConfig } from '../../utils/helpers'
import { Briefcase, ChevronRight, Clock } from 'lucide-react'
import { InlineLoader, EmptyState, StatusBadge, Pagination } from '../../components/common/LoadingSpinner'

const FILTERS = [
  { value: '', label: 'All Jobs' },
  { value: 'provider_assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function ProviderJobsPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['provider-jobs', { status, page }],
    queryFn: () => bookingsAPI.getProviderJobs({ status: status || undefined, page, limit: 10 }),
    select: d => d.data
  })

  const jobs = data?.data?.bookings || []
  const meta = data?.meta

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">My Jobs</h1>
        <p className="page-subtitle">All your assigned service jobs</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => { setStatus(f.value); setPage(1) }}
            className={`flex-shrink-0 px-4 py-2 rounded-2xl text-sm font-medium transition-all
              ${status === f.value ? 'bg-brand-600 text-white' : 'bg-white/[0.03] border border-white/10 text-slate-400 hover:border-brand-300'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? <InlineLoader /> : jobs.length === 0 ? (
        <EmptyState icon={Briefcase} title="No jobs found" description="Jobs assigned to you will appear here" />
      ) : (
        <div className="table-wrapper">
          <div className="divide-y divide-slate-50">
            {jobs.map(job => (
              <div key={job._id} onClick={() => navigate(`/provider/jobs/${job._id}`)}
                className="p-5 hover:bg-white/5 cursor-pointer transition-colors flex items-center gap-4 group">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getStatusConfig(job.status).dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-white">{job.serviceName}</p>
                    <StatusBadge status={job.status} />
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                    <span>{job.customer?.name}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{formatDate(job.scheduledDate)} · {job.scheduledTime}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-emerald-600">{formatCurrency(job.providerEarning)}</p>
                  <p className="text-xs text-slate-400">earnings</p>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 flex-shrink-0" />
              </div>
            ))}
          </div>
          <Pagination meta={meta} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
