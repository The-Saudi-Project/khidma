import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { bookingsAPI, payoutsAPI } from '../../api'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency, formatDate, getStatusConfig } from '../../utils/helpers'
import { Briefcase, CheckCircle, DollarSign, Clock, ChevronRight, TrendingUp } from 'lucide-react'
import { InlineLoader, StatCard, StatusBadge } from '../../components/common/LoadingSpinner'

export default function ProviderDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['provider-jobs', 'active'],
    queryFn: () => bookingsAPI.getProviderJobs({ status: 'provider_assigned', limit: 5 }),
    select: d => d.data.data.bookings
  })

  const { data: earningsData, isLoading: earningsLoading } = useQuery({
    queryKey: ['provider-earnings'],
    queryFn: () => payoutsAPI.getProviderEarnings(),
    select: d => d.data.data
  })

  const activeJobs = jobsData || []
  const earnings = earningsData?.summary || {}

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Good day, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">Here's your provider overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Earned" icon={TrendingUp} color="green"
          value={formatCurrency(earnings.totalEarned || 0)} />
        <StatCard label="Pending Earnings" icon={Clock} color="yellow"
          value={formatCurrency(earnings.pendingEarnings || 0)} />
        <StatCard label="Total Paid Out" icon={DollarSign} color="blue"
          value={formatCurrency(earnings.totalPaidOut || 0)} />
      </div>

      {/* Active jobs */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Active Jobs</h2>
        <button onClick={() => navigate('/provider/jobs')}
          className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
          View all <ChevronRight size={14} />
        </button>
      </div>

      {jobsLoading ? <InlineLoader /> : activeJobs.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Briefcase size={22} className="text-slate-400" />
          </div>
          <p className="font-semibold text-slate-700">No active jobs</p>
          <p className="text-sm text-slate-400 mt-1">New jobs will appear here when assigned</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeJobs.map(job => (
            <div key={job._id} onClick={() => navigate(`/provider/jobs/${job._id}`)}
              className="card p-4 cursor-pointer hover:shadow-card-hover transition-all group flex items-center gap-4">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getStatusConfig(job.status).dot}`} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 truncate">{job.serviceName}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                  <span>{job.customer?.name}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />{formatDate(job.scheduledDate)} at {job.scheduledTime}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-emerald-600">{formatCurrency(job.providerEarning)}</p>
                <p className="text-xs text-slate-400">your cut</p>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
