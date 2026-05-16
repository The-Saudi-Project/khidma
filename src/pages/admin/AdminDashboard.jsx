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
      <div className="bg-gradient-to-r from-[#0B1120] via-[#162B4E] to-[#0B1120] rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 end-0 w-72 h-72 bg-[#22C55E]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

        <div className="max-w-xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#22C55E]/20 text-[#22C55E] font-mono text-[9px] font-extrabold uppercase tracking-widest mb-3 border border-[#22C55E]/30">
            <Sparkles size={11} /> Root Vault Command
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-none">
            Master Node Overview
          </h1>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Live cryptographic dispatch network streams are unthrottled. Direct administrative triggers for clearing user wire uploads and allocating specialized KSA technician units are arrayed below.
          </p>
        </div>

        {/* Global operational indicators */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-slate-400">Escrow Core System: <strong className="text-white font-bold">Encrypted &amp; Online</strong></span>
          </div>
          <span className="text-[10px] text-[#22C55E] font-mono font-bold tracking-widest uppercase">SAR Escrow Vault Base</span>
        </div>
      </div>

      {/* Critical Operational Attention Task widgets */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Priority Action Pipelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <button type="button" onClick={() => navigate('/admin/payments')}
            className={`p-5 rounded-3xl border text-start transition-all duration-200 relative overflow-hidden group ${
              (metrics?.pendingPaymentReview || 0) > 0
                ? 'bg-red-50/90 border-red-200 shadow-2xl hover:bg-red-50'
                : 'bg-white/[0.03] border-white/5 hover:border-white/10 shadow-2xl'
            }`}>
            <div className="absolute top-0 end-0 bg-red-500/10 text-red-600 p-2 rounded-bl-2xl">
              <AlertTriangle size={16} />
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-white group-hover:text-white">Wire Audit Buffer</span>
              {(metrics?.pendingPaymentReview || 0) > 0 && (
                <span className="bg-red-600 text-white font-mono text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-2xl animate-pulse">
                  {metrics.pendingPaymentReview}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-2">Receipt snapshots awaiting root administrative clearance to transition SLA.</p>
          </button>

          <button type="button" onClick={() => navigate('/admin/bookings')}
            className={`p-5 rounded-3xl border text-start transition-all duration-200 relative overflow-hidden group ${
              (metrics?.pendingProviderAssignment || 0) > 0
                ? 'bg-amber-50/90 border-amber-200 shadow-2xl hover:bg-amber-50'
                : 'bg-white/[0.03] border-white/5 hover:border-white/10 shadow-2xl'
            }`}>
            <div className="absolute top-0 end-0 bg-amber-500/10 text-amber-600 p-2 rounded-bl-2xl">
              <Layers size={16} />
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-white group-hover:text-white">Assign Units</span>
              {(metrics?.pendingProviderAssignment || 0) > 0 && (
                <span className="bg-amber-500 text-white font-mono text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-2xl animate-pulse">
                  {metrics.pendingProviderAssignment}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-2">Paid orders cleared by escrow locked in technician matching queues.</p>
          </button>

          <button type="button" onClick={() => navigate('/admin/provider-applications')}
            className={`p-5 rounded-3xl border text-start transition-all duration-200 relative overflow-hidden group ${
              (metrics?.pendingApplications || 0) > 0
                ? 'bg-blue-50/90 border-blue-200 shadow-2xl hover:bg-blue-50'
                : 'bg-white/[0.03] border-white/5 hover:border-white/10 shadow-2xl'
            }`}>
            <div className="absolute top-0 end-0 bg-blue-500/10 text-blue-600 p-2 rounded-bl-2xl">
              <UserCheck size={16} />
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-white group-hover:text-white">Onboarding Nodes</span>
              {(metrics?.pendingApplications || 0) > 0 && (
                <span className="bg-blue-600 text-white font-mono text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-2xl animate-pulse">
                  {metrics.pendingApplications}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-2">Talent applicants awaiting manual qualification checks.</p>
          </button>

        </div>
      </div>

      {/* Supreme Financial Partition Array */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Real-Time Multi-Tier Clearing Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white/[0.03] rounded-3xl p-5 border border-white/5 shadow-2xl relative overflow-hidden">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Total System Liquidity</span>
            <span className="text-2xl font-extrabold text-white font-mono tracking-tight block">{formatCurrency(metrics?.totalRevenue || 0)}</span>
            <span className="text-[10px] text-slate-400 block mt-2 pt-2 border-t border-slate-50">Global verified patron charges</span>
          </div>

          <div className="bg-white/[0.03] rounded-3xl p-5 border border-white/5 shadow-2xl relative overflow-hidden border-b-4 border-b-[#22C55E]">
            <span className="text-[10px] font-bold text-[#22C55E] uppercase tracking-wide block mb-1">Khidma Capital Reserve</span>
            <span className="text-2xl font-extrabold text-[#22C55E] font-mono tracking-tight block">{formatCurrency(metrics?.platformRevenue || 0)}</span>
            <span className="text-[10px] text-slate-400 block mt-2 pt-2 border-t border-slate-50">Retained platform commission pool (30%)</span>
          </div>

          <div className="bg-white/[0.03] rounded-3xl p-5 border border-white/5 shadow-2xl relative overflow-hidden border-b-4 border-b-[#10B981]">
            <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wide block mb-1">Distributed Fleet Remittance</span>
            <span className="text-2xl font-extrabold text-[#10B981] font-mono tracking-tight block">{formatCurrency(metrics?.providerPayouts || 0)}</span>
            <span className="text-[10px] text-slate-400 block mt-2 pt-2 border-t border-slate-50">Direct technical provider settlements (70%)</span>
          </div>
        </div>
      </div>

      {/* Aggregate Network Dispatch Status Array */}
      <div className="bg-white/[0.03] rounded-3xl p-6 border border-white/5 shadow-2xl">
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

        <div className="bg-white/[0.03] rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
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
              <tbody className="divide-y divide-slate-50 text-xs">
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
