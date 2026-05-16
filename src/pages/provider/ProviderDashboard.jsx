import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { bookingsAPI, payoutsAPI } from '../../api'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency, formatDate, getStatusConfig } from '../../utils/helpers'
import {
  Briefcase, CheckCircle, DollarSign, Clock, ChevronRight,
  TrendingUp, Sparkles, MapPin, Compass, AlertCircle
} from 'lucide-react'
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
    <div className="animate-fade-in pb-12 space-y-8">
      {/* Welcome Banner */}
      {/* Welcome Banner */}
      <div className="bg-[#0B1120] rounded-[2rem] p-8 lg:p-12 text-white relative overflow-hidden border border-white/5 shadow-2xl">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 text-brand-400 font-bold text-[10px] uppercase tracking-widest mb-6 border border-brand-500/20">
            <Sparkles size={12} /> Dashboard Overview
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-none">
            Welcome back, <span className="text-brand-500">{user?.name?.split(' ')[0] || 'Partner'}.</span>
          </h1>
          <p className="text-sm text-slate-400 mt-4 leading-relaxed font-medium">
            Manage your active bookings, view recent requests, and track your earnings.
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-300">Account Status: <span className="text-brand-400">Verified</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Region: KSA Standard
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card !p-8 group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-brand-500/10 transition-colors">
              <TrendingUp size={20} className="text-slate-400 group-hover:text-brand-400" />
            </div>
            <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest px-2 py-1 bg-brand-500/10 rounded-lg">Cleared</span>
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight block mb-1">Total Earnings</p>
          <p className="text-3xl font-extrabold text-white font-mono tracking-tight">{formatCurrency(earnings.totalEarned || 0)}</p>
        </div>

        <div className="glass-card !p-8 group border-amber-500/20 bg-amber-500/[0.02]">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-amber-500/10 transition-colors">
              <Clock size={20} className="text-slate-400 group-hover:text-amber-400" />
            </div>
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest px-2 py-1 bg-amber-500/10 rounded-lg">Pending</span>
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight block mb-1">Pending Earnings</p>
          <p className="text-3xl font-extrabold text-amber-500 font-mono tracking-tight">{formatCurrency(earnings.pendingEarnings || 0)}</p>
        </div>

        <div className="glass-card !p-8 group border-brand-400/20 bg-brand-400/[0.02]">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-brand-400/10 transition-colors">
              <DollarSign size={20} className="text-slate-400 group-hover:text-brand-300" />
            </div>
            <span className="text-[10px] font-black text-brand-300 uppercase tracking-widest px-2 py-1 bg-brand-400/10 rounded-lg">Deposited</span>
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight block mb-1">Total Deposits</p>
          <p className="text-3xl font-extrabold text-brand-300 font-mono tracking-tight">{formatCurrency(earnings.totalPaidOut || 0)}</p>
        </div>
      </div>

      {/* Bookings Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight">Recent Bookings</h2>
            <p className="text-xs text-slate-400">View your latest service appointments</p>
          </div>
          <button onClick={() => navigate('/provider/jobs')} type="button"
            className="text-xs font-bold text-[#22C55E] hover:underline flex items-center gap-1">
            View All <ChevronRight size={14} />
          </button>
        </div>

        {jobsLoading ? (
          <InlineLoader />
        ) : activeJobs.length === 0 ? (
          <div className="glass rounded-3xl p-10 border border-white/5 text-center space-y-3 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center mx-auto text-slate-400">
              <Compass size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-300">No active bookings found.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {activeJobs.map(job => (
              <div key={job._id} onClick={() => navigate(`/provider/jobs/${job._id}`)}
                className="glass rounded-2xl p-4 border border-white/5 hover:border-[#22C55E]/40 cursor-pointer transition-all shadow-2xl hover:shadow-md group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl glass border border-white/5 flex items-center justify-center flex-shrink-0 text-slate-400 group-hover:bg-[#0B1120] group-hover:text-[#22C55E] transition-colors">
                    <Briefcase size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-bold text-white truncate group-hover:text-white">{job.serviceName}</p>
                      <span className="text-[9px] font-mono bg-white/5 px-1.5 py-0.5 rounded text-slate-400">
                        #{job.bookingNumber || job._id.slice(-4).toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-slate-400">
                      <span className="font-medium text-slate-400">{job.customer?.name || 'Customer'}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="text-slate-400" />
                        {formatDate(job.scheduledDate)} @ {job.scheduledTime}
                      </span>
                      {job.address?.city && (
                        <span className="flex items-center gap-1 text-[#22C55E]">
                          <MapPin size={11} />
                          {job.address.city}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-white/[0.05] flex-shrink-0">
                  <div className="text-start sm:text-right">
                    <p className="text-xs font-mono font-extrabold text-[#10B981]">
                      {formatCurrency(job.providerEarning || (job.totalAmount ? job.totalAmount * 0.7 : 0))}
                    </p>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Guaranteed Split</p>
                  </div>
                  
                  <div className="w-7 h-7 rounded-2xl glass group-hover:bg-[#22C55E]/10 flex items-center justify-center text-slate-400 group-hover:text-[#22C55E] transition-colors">
                    <ChevronRight size={14} />
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
