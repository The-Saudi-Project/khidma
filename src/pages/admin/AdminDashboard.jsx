import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { bookingsAPI } from '../../api'
import { formatCurrency, formatDate, getStatusConfig } from '../../utils/helpers'
import {
  CalendarDays, CheckCircle, XCircle, Clock,
  DollarSign, TrendingUp, ChevronRight, Activity,
  AlertTriangle, ShieldCheck, UserCheck, Layers, Sparkles
} from 'lucide-react'
import { InlineLoader, StatCard, StatusBadge } from '../../components/common/LoadingSpinner'

export default function AdminDashboard() {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: () => bookingsAPI.getAdminMetrics(),
    select: d => d.data.data,
    refetchInterval: 30000
  })

  if (isLoading) return <InlineLoader />

  const { metrics, recentBookings } = data || {}

  return (
    <div className="animate-fade-in pb-12 space-y-8">
      {/* Executive Supreme Master Heading */}
      <div className="bg-[#0B1120] rounded-[2rem] p-8 lg:p-12 text-white relative overflow-hidden border border-white/5 shadow-2xl">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 text-brand-400 font-bold text-[10px] uppercase tracking-widest mb-6 border border-brand-500/20">
            <Sparkles size={12} /> Root Command Center
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-none">
            Infrastructure <span className="text-brand-500">Overview.</span>
          </h1>
          <p className="text-sm text-slate-400 mt-4 leading-relaxed font-medium">
            Live telemetry from the Gulf service cluster is synchronized. Monitor real-time dispatch state, financial clearing, and technician availability modules.
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-300">System Integrity: <span className="text-brand-400">Verified</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Region: KSA Central
            </div>
          </div>
        </div>
      </div>

      {/* Critical Operational Attention Task widgets */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Priority Dispatch Queues</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <button type="button" onClick={() => navigate('/admin/payments')}
            className={`glass-card !p-8 text-start group relative overflow-hidden ${
              (metrics?.pendingPaymentReview || 0) > 0 ? 'border-red-500/30 bg-red-500/5' : ''
            }`}>
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-red-500/10 transition-colors">
                <AlertTriangle size={20} className="text-slate-400 group-hover:text-red-400" />
              </div>
              {(metrics?.pendingPaymentReview || 0) > 0 && (
                <div className="px-3 py-1 bg-red-500 text-white text-[10px] font-black rounded-full shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                  {metrics.pendingPaymentReview} Pending
                </div>
              )}
            </div>
            <h3 className="text-lg font-extrabold text-white mb-2">Wire Audit Buffer</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">Snapshot verification required for escrow release.</p>
          </button>

          <button type="button" onClick={() => navigate('/admin/bookings')}
            className={`glass-card !p-8 text-start group relative overflow-hidden ${
              (metrics?.pendingProviderAssignment || 0) > 0 ? 'border-amber-500/30 bg-amber-500/5' : ''
            }`}>
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-amber-500/10 transition-colors">
                <Layers size={20} className="text-slate-400 group-hover:text-amber-400" />
              </div>
              {(metrics?.pendingProviderAssignment || 0) > 0 && (
                <div className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black rounded-full shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                  {metrics.pendingProviderAssignment} Pending
                </div>
              )}
            </div>
            <h3 className="text-lg font-extrabold text-white mb-2">Technician Matching</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">Verified orders awaiting unit allocation.</p>
          </button>

          <button type="button" onClick={() => navigate('/admin/provider-applications')}
            className={`glass-card !p-8 text-start group relative overflow-hidden ${
              (metrics?.pendingApplications || 0) > 0 ? 'border-brand-500/30 bg-brand-500/5' : ''
            }`}>
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-brand-500/10 transition-colors">
                <UserCheck size={20} className="text-slate-400 group-hover:text-brand-400" />
              </div>
              {(metrics?.pendingApplications || 0) > 0 && (
                <div className="px-3 py-1 bg-brand-500 text-[#0B1120] text-[10px] font-black rounded-full shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                  {metrics.pendingApplications} Pending
                </div>
              )}
            </div>
            <h3 className="text-lg font-extrabold text-white mb-2">Talent Onboarding</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">Service partner credentials awaiting audit.</p>
          </button>
        </div>
      </div>

      {/* Supreme Financial Partition Array */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Real-Time Multi-Tier Clearing Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass rounded-3xl p-5 border border-white/5 shadow-2xl relative overflow-hidden">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Total System Liquidity</span>
            <span className="text-2xl font-extrabold text-white font-mono tracking-tight block">{formatCurrency(metrics?.totalRevenue || 0)}</span>
            <span className="text-[10px] text-slate-400 block mt-2 pt-2 border-t border-white/[0.05]">Global verified patron charges</span>
          </div>

          <div className="glass rounded-3xl p-5 border border-white/5 shadow-2xl relative overflow-hidden border-b-4 border-b-[#22C55E]">
            <span className="text-[10px] font-bold text-[#22C55E] uppercase tracking-wide block mb-1">Khidma Capital Reserve</span>
            <span className="text-2xl font-extrabold text-[#22C55E] font-mono tracking-tight block">{formatCurrency(metrics?.platformRevenue || 0)}</span>
            <span className="text-[10px] text-slate-400 block mt-2 pt-2 border-t border-white/[0.05]">Retained platform commission pool (30%)</span>
          </div>

          <div className="glass rounded-3xl p-5 border border-white/5 shadow-2xl relative overflow-hidden border-b-4 border-b-[#10B981]">
            <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wide block mb-1">Distributed Fleet Remittance</span>
            <span className="text-2xl font-extrabold text-[#10B981] font-mono tracking-tight block">{formatCurrency(metrics?.providerPayouts || 0)}</span>
            <span className="text-[10px] text-slate-400 block mt-2 pt-2 border-t border-white/[0.05]">Direct technical provider settlements (70%)</span>
          </div>
        </div>
      </div>

      {/* Aggregate Network Dispatch Status Array */}
      <div className="glass rounded-3xl p-6 border border-white/5 shadow-2xl">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Network Indices Distribution</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">Aggregate</span>
            <span className="text-xl font-extrabold text-white font-mono block mt-1">{(metrics?.totalBookings || 0).toLocaleString()}</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-tight block">Active SLA</span>
            <span className="text-xl font-extrabold text-amber-600 font-mono block mt-1">{(metrics?.activeBookings || 0).toLocaleString()}</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
            <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-tight block">Executed</span>
            <span className="text-xl font-extrabold text-[#10B981] font-mono block mt-1">{(metrics?.completedBookings || 0).toLocaleString()}</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-tight block">Aborted</span>
            <span className="text-xl font-extrabold text-red-500 font-mono block mt-1">{(metrics?.cancelledBookings || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Data Ledger Table View */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-extrabold text-white tracking-tight uppercase">Recent Telemetry Feed</h2>
          <button onClick={() => navigate('/admin/bookings')} type="button"
            className="text-xs font-bold text-[#22C55E] hover:underline flex items-center gap-1">
            Access Full Ledger <ChevronRight size={14} />
          </button>
        </div>

        <div className="glass rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  <th className="py-3 px-4">Identifier</th>
                  <th className="py-3 px-4">Service Descriptor</th>
                  <th className="py-3 px-4">Origin Node</th>
                  <th className="py-3 px-4">SLA State</th>
                  <th className="py-3 px-4 text-right">Escrow Quoted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-xs">
                {recentBookings?.map(b => (
                  <tr key={b._id} onClick={() => navigate(`/admin/bookings/${b._id}`)}
                    className="hover:bg-white/5 cursor-pointer transition-colors group">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400 group-hover:text-white">
                      #{b.bookingNumber || b._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {b.serviceName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-medium truncate max-w-[120px]">
                      {b.customer?.name || 'Patron Asset'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-white">
                      {formatCurrency(b.totalAmount)}
                    </td>
                  </tr>
                ))}
                {(!recentBookings || recentBookings.length === 0) && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400 text-xs font-medium">
                      Zero cryptographically logged dispatches located in short term persistence buffer.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
