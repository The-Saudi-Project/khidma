import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Briefcase, DollarSign, User,
  LogOut, Bell, ShieldCheck, Zap
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar } from './LoadingSpinner'
import LanguageToggle from './LanguageToggle'
import { useNotifications } from '../../hooks/useNotifications'
import BottomNav from './BottomNav'
import PWAInstallBanner from './PWAInstallBanner'

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: ProviderLayout
// PURPOSE: Layout shell for logged-in Providers. Features a green accent theme.
// KEY DECISIONS:
//   - Removed mobile hamburger drawer in favor of BottomNav (PWA goal)
//   - Integrated PWAInstallBanner
//   - Added UI for "Status: Available/Offline" as requested
// ─────────────────────────────────────────────────────────────────────────────

export default function ProviderLayout() {
  const { t } = useTranslation('common')
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const { unreadCount, notifications, markAllAsRead } = useNotifications()

  // TODO: Connect to backend PATCH /api/provider/availability
  const [isAvailable, setIsAvailable] = useState(() => {
    return localStorage.getItem('khidma_provider_status') !== 'offline'
  })

  const toggleAvailability = () => {
    const newState = !isAvailable
    setIsAvailable(newState)
    localStorage.setItem('khidma_provider_status', newState ? 'available' : 'offline')
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Floating Navy shell wrapper tailored for premium feel (Desktop) */}
      <aside className="hidden lg:flex flex-col w-72 p-4 sticky top-0 h-screen flex-shrink-0">
        <div className="flex-1 bg-[#081225] rounded-3xl p-5 flex flex-col justify-between border border-white/10 shadow-glass text-white relative overflow-hidden">
          {/* Green highlight abstract lighting bloom */}
          <div className="absolute top-0 end-0 w-32 h-32 bg-[#10B981]/10 rounded-full blur-2xl pointer-events-none" />

          <SidebarContent 
            user={user}
            onLogout={handleLogout}
            isAvailable={isAvailable}
            toggleAvailability={toggleAvailability}
          />
        </div>
      </aside>

      {/* Principal layout pipeline */}
      {/* Added pb-20 to ensure content isn't hidden behind the BottomNav on mobile */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        <header className="hidden lg:flex items-center justify-end gap-4 px-8 py-4 sticky top-0 z-30 bg-surface-50/80 backdrop-blur-md">
          {/* Signal active state preview badge */}
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-xl border border-slate-100 shadow-sm text-xs text-slate-500 font-medium me-auto">
            <Zap size={14} className="text-[#10B981]" />
            <span>Telemetry Channel Active</span>
          </div>

          <LanguageToggle />
          
          <div className="relative">
            <button type="button" onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2.5 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-slate-200 text-slate-700 transition-colors"
              aria-label="Notifications">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -end-1 min-w-[1.25rem] h-[1.25rem] px-1 bg-[#10B981] text-[#081225] text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute end-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-modal z-50 text-start animate-scale-in">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Fleet Tasks</span>
                  <button type="button" className="text-xs text-[#10B981] font-bold hover:underline" onClick={() => { markAllAsRead(); setNotifOpen(false) }}>
                    {t('actions.markAllRead')}
                  </button>
                </div>
                <ul className="divide-y divide-slate-50">
                  {notifications.slice(0, 5).map((n) => (
                    <li key={n._id} className="p-3 hover:bg-slate-50/80 transition-colors">
                      <p className="text-xs font-bold text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                    </li>
                  ))}
                  {!notifications.length && (
                    <li className="text-xs text-slate-400 py-8 text-center">Zero incoming job alerts.</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </header>

        {/* Mobile top structural header - Minimalist */}
        <header className="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center font-black text-[#081225]">K</div>
            <span className="font-extrabold text-[#081225] text-lg tracking-tight">Khidma Fleet</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/provider/profile')} // Map bell to profile on mobile
              className="relative p-2 text-slate-700"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#10B981] rounded-full" />
              )}
            </button>
            <LanguageToggle />
          </div>
        </header>

        <main className="flex-1 p-4 lg:px-8 lg:py-4 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Native App Elements */}
      <BottomNav role="provider" />
      <PWAInstallBanner />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: SidebarContent
// PURPOSE: Reusable sidebar logic (now exclusive to desktop view)
// ─────────────────────────────────────────────────────────────────────────────
function SidebarContent({ user, onLogout, isAvailable, toggleAvailability }) {
  const { t } = useTranslation('common')
  const NAV = [
    { to: '/provider', label: t('nav.dashboard'), icon: LayoutDashboard, end: true },
    { to: '/provider/jobs', label: t('nav.jobs'), icon: Briefcase },
    { to: '/provider/earnings', label: t('nav.earnings'), icon: DollarSign },
    { to: '/provider/profile', label: t('nav.profile'), icon: User },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Upper Brand Badge area */}
      <div>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#10B981] rounded-xl flex items-center justify-center text-[#081225] font-black text-base shadow-sm">
              K
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight block leading-none">{t('appName')}</span>
              <span className="text-[9px] font-mono tracking-widest uppercase text-[#10B981] block mt-0.5">Talent Fleet</span>
            </div>
          </div>
        </div>

        {/* Live matching beacon simulator inside workspace shell */}
        <div className={`mb-6 rounded-xl p-3 border transition-colors ${isAvailable ? 'bg-gradient-to-r from-[#10B981]/10 to-transparent border-[#10B981]/20' : 'bg-white/5 border-white/10'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Status</span>
            <button 
              onClick={toggleAvailability}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isAvailable ? 'bg-[#10B981]' : 'bg-slate-600'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isAvailable ? 'translate-x-4.5' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isAvailable ? 'bg-[#10B981] animate-ping' : 'bg-slate-500'}`} />
            <div className="flex-1 min-w-0">
              <p className={`text-xs truncate font-medium ${isAvailable ? 'text-[#10B981]' : 'text-slate-400'}`}>
                {isAvailable ? 'SLA dispatch active' : 'Offline / Invisible'}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic navigation matrix */}
        <nav className="flex flex-col gap-1.5">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#10B981] text-[#081225] shadow-sm font-black tracking-wide'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Embedded footer operations dashboard telemetry */}
      <div className="pt-4 border-t border-white/10 space-y-2 mt-auto">
        <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/5">
          <Avatar name={user?.name || 'Talent User'} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate flex items-center gap-1">
              <span>{user?.name || 'Verified Tech'}</span>
              <ShieldCheck size={12} className="text-[#10B981] flex-shrink-0" />
            </p>
            <p className="text-[10px] text-[#C5A059] font-mono truncate">Tier-1 Cleared</p>
          </div>
        </div>

        <button type="button" onClick={onLogout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
          <LogOut size={16} />
          <span>{t('actions.logout')}</span>
        </button>
      </div>
    </div>
  )
}

