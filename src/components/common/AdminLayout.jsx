import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, CalendarDays, Settings, Users,
  CreditCard, DollarSign, HeadphonesIcon, LogOut, Menu,
  X, ShieldCheck, UserPlus, Zap, Crown
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LanguageToggle from './LanguageToggle'
import { useState } from 'react'
import { Avatar } from './LoadingSpinner'

export default function AdminLayout() {
  const { t } = useTranslation('common')
  const NAV = [
    { to: '/admin', label: t('nav.dashboard'), icon: LayoutDashboard, end: true },
    { to: '/admin/bookings', label: t('nav.adminBookings'), icon: CalendarDays },
    { to: '/admin/payments', label: t('nav.payments'), icon: CreditCard },
    { to: '/admin/payouts', label: t('nav.payouts'), icon: DollarSign },
    { to: '/admin/services', label: t('nav.adminServices'), icon: Settings },
    { to: '/admin/users', label: t('nav.users'), icon: Users },
    { to: '/admin/provider-applications', label: t('nav.applications'), icon: UserPlus },
    { to: '/admin/support', label: t('nav.adminSupport'), icon: HeadphonesIcon },
    { to: '/admin/audit', label: t('nav.audit'), icon: ShieldCheck },
  ]
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const SidebarContent = ({ onClose }) => (
    <div className="flex flex-col h-full">
      {/* Upper Brand Crown Container */}
      <div>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C5A059] rounded-xl flex items-center justify-center text-[#081225] font-black text-base shadow-sm">
              <Crown size={18} className="fill-[#081225]" />
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight block leading-none">{t('appName')}</span>
              <span className="text-[9px] font-mono tracking-widest uppercase text-[#C5A059] block mt-0.5">Master Node</span>
            </div>
          </div>
          
          {onClose && (
            <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Master Node Cluster Status string */}
        <div className="mb-5 bg-gradient-to-r from-[#C5A059]/10 to-transparent rounded-xl p-3 border border-[#C5A059]/20 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider">Absolute Authority</p>
            <p className="text-xs text-slate-300 truncate">Core indices decrypted</p>
          </div>
        </div>

        {/* Dense Administration Links Matrix */}
        <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-320px)] pe-1 custom-scrollbar">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#C5A059] text-[#081225] shadow-sm font-black tracking-wide'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }>
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Embedded footer operations profile setup */}
      <div className="pt-4 border-t border-white/10 space-y-2 mt-auto">
        <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/5">
          <Avatar name={user?.name || 'Administrator'} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate flex items-center gap-1">
              <span>{user?.name || 'Root Executive'}</span>
              <ShieldCheck size={12} className="text-[#C5A059] flex-shrink-0" />
            </p>
            <p className="text-[10px] text-[#10B981] font-mono truncate">Full Escrow Access</p>
          </div>
        </div>

        <button type="button" onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
          <LogOut size={16} />
          <span>{t('actions.logout')}</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Floating Navy shell wrapper tailored for supreme administrative presence */}
      <aside className="hidden lg:flex flex-col w-72 p-4 sticky top-0 h-screen flex-shrink-0">
        <div className="flex-1 bg-[#081225] rounded-3xl p-5 flex flex-col justify-between border border-white/10 shadow-glass text-white relative overflow-hidden">
          {/* Subtle gold backstop bloom */}
          <div className="absolute top-0 end-0 w-32 h-32 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none" />

          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Drawer wrapper */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute start-0 top-0 bottom-0 w-72 bg-[#081225] text-white p-5 z-10 flex flex-col justify-between">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Principal workspace viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden lg:flex items-center justify-end gap-4 px-8 py-4 sticky top-0 z-30 bg-surface-50/80 backdrop-blur-md">
          {/* Signal status verification text */}
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-xl border border-slate-100 shadow-sm text-xs text-slate-500 font-medium me-auto">
            <Zap size={14} className="text-[#C5A059]" />
            <span>Encrypted Administration Array Active</span>
          </div>

          <LanguageToggle />
        </header>

        {/* Mobile top structural header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center gap-3">
          <button type="button" onClick={() => setMobileOpen(true)} className="p-2 bg-slate-50 rounded-xl text-slate-700">
            <Menu size={20} />
          </button>
          <span className="font-extrabold text-[#081225] text-lg flex-1 tracking-tight">Khidma Node</span>
          <LanguageToggle />
        </header>

        <main className="flex-1 p-4 lg:px-8 lg:py-4 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
