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
      <div className="bg-gradient-to-r from-[#081225] via-[#122442] to-[#081225] rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden shadow-glass">
        {/* Subtle radial light backstop */}
        <div className="absolute -top-20 -end-20 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

        <div className="max-w-xl relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-[#C5A059] uppercase tracking-widest mb-3">
            <Sparkles size={12} /> Live Gulf Operations
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-none">
            Welcome back, {user?.name?.split(' ')[0] || 'Technician'} 👋
          </h1>
          <p className="text-xs lg:text-sm text-slate-300 mt-2 leading-relaxed">
            Your automated assignment matrices are synchronized. Monitor your custom regional dispatch coordinates and instantaneous clearing splits below.
          </p>
        </div>

        {/* Real-time readiness gauge footer element */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] ring-4 ring-[#10B981]/20" />
            <span>Escrow Buffer: <strong className="text-white font-bold">100% Guaranteed</strong></span>
          </div>
          <span className="font-mono text-[11px] text-[#C5A059]">KSA Hub Standard Routing</span>
        </div>
      </div>

      {/* Luxury KPI Metric Gauge Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-[#C5A059]/40 transition-colors">
          <div className="absolute top-0 end-0 bg-slate-50 p-2 rounded-bl-2xl text-slate-400 group-hover:bg-[#C5A059]/10 group-hover:text-[#C5A059] transition-colors">
            <TrendingUp size={16} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Cleared Earnings</p>
          <p className="text-2xl font-black text-[#081225] font-mono tracking-tight">{formatCurrency(earnings.totalEarned || 0)}</p>
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-50">
            <span>Direct Payout Flow</span>
            <span className="text-[#10B981] font-bold">Cleared</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-[#C5A059]/40 transition-colors">
          <div className="absolute top-0 end-0 bg-slate-50 p-2 rounded-bl-2xl text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors">
            <Clock size={16} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Escrow Awaiting Handshake</p>
          <p className="text-2xl font-black text-amber-600 font-mono tracking-tight">{formatCurrency(earnings.pendingEarnings || 0)}</p>
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-50">
            <span>SLA Delivery Backstop</span>
            <span className="text-amber-500 font-bold">Pending Execution</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-[#C5A059]/40 transition-colors">
          <div className="absolute top-0 end-0 bg-slate-50 p-2 rounded-bl-2xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
            <DollarSign size={16} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Vault Deposits</p>
          <p className="text-2xl font-black text-blue-600 font-mono tracking-tight">{formatCurrency(earnings.totalPaidOut || 0)}</p>
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-50">
            <span>Transferred to Account</span>
            <span className="text-blue-500 font-bold">Locked</span>
          </div>
        </div>
      </div>

      {/* Core Operational Dispatches Stream Viewport */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-extrabold text-[#081225] tracking-tight">Active Dispatches Array</h2>
            <p className="text-xs text-slate-400">Target jobs instantly mapped to your verified profile coordinates</p>
          </div>
          <button onClick={() => navigate('/provider/jobs')} type="button"
            className="text-xs font-bold text-[#C5A059] hover:underline flex items-center gap-1">
            Access Full Pipeline <ChevronRight size={14} />
          </button>
        </div>

        {jobsLoading ? (
          <InlineLoader />
        ) : activeJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-100 text-center space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
              <Compass size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">Zero Target Missions Currently Active</p>
              <p className="text-[11px] text-slate-400 mt-0.5">As customer escrows clear verification, automated matching assigns immediate tasks here.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {activeJobs.map(job => (
              <div key={job._id} onClick={() => navigate(`/provider/jobs/${job._id}`)}
                className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-[#C5A059]/40 cursor-pointer transition-all shadow-sm hover:shadow-md group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400 group-hover:bg-[#081225] group-hover:text-[#C5A059] transition-colors">
                    <Briefcase size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-bold text-slate-900 truncate group-hover:text-[#081225]">{job.serviceName}</p>
                      <span className="text-[9px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                        #{job.bookingNumber || job._id.slice(-4).toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-slate-400">
                      <span className="font-medium text-slate-600">{job.customer?.name || 'Patron Asset'}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="text-slate-400" />
                        {formatDate(job.scheduledDate)} @ {job.scheduledTime}
                      </span>
                      {job.address?.city && (
                        <span className="flex items-center gap-1 text-[#C5A059]">
                          <MapPin size={11} />
                          {job.address.city}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-slate-50 flex-shrink-0">
                  <div className="text-start sm:text-right">
                    <p className="text-xs font-mono font-black text-[#10B981]">
                      {formatCurrency(job.providerEarning || (job.totalAmount ? job.totalAmount * 0.7 : 0))}
                    </p>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Guaranteed Split</p>
                  </div>
                  
                  <div className="w-7 h-7 rounded-xl bg-slate-50 group-hover:bg-[#C5A059]/10 flex items-center justify-center text-slate-400 group-hover:text-[#C5A059] transition-colors">
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
